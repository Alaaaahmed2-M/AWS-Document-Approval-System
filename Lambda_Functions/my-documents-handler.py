import json, boto3
from boto3.dynamodb.conditions import Attr
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('DocApproval-Documents')
s3 = boto3.client('s3')
BUCKET = 'docapproval-serverless'

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    raise TypeError

def lambda_handler(event, context):
    claims = event.get('requestContext', {}).get('authorizer', {}).get('jwt', {}).get('claims', {})
    email = claims.get('email')

    if not email:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'})
        }

    response = table.scan(FilterExpression=Attr('uploadedBy').eq(email))
    items = response.get('Items', [])

    for item in items:
        if item.get('status') == 'pending' and item.get('s3Key'):
            try:
                item['fileUrl'] = s3.generate_presigned_url(
                    'get_object',
                    Params={'Bucket': BUCKET, 'Key': item['s3Key']},
                    ExpiresIn=300
                )
            except Exception:
                pass

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'documents': items}, default=decimal_default)
    }