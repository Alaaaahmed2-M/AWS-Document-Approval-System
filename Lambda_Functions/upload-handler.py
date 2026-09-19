import json, boto3, uuid
from datetime import datetime
from botocore.client import Config

s3 = boto3.client('s3', config=Config(signature_version='s3v4'))
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('DocApproval-Documents')
BUCKET = 'docapproval-serverless'

def lambda_handler(event, context):
    body = json.loads(event['body'])
    document_id = str(uuid.uuid4())
    filename = body['filename']
    s3_key = f"pending/{document_id}_{filename}"

    table.put_item(Item={
        'documentId': document_id,
        'title': body['title'],
        'description': body.get('description', ''),
        'uploadedBy': body['uploadedBy'],
        'status': 'pending',
        's3Key': s3_key,
        'createdAt': datetime.utcnow().isoformat(),
    })

    presigned_url = s3.generate_presigned_url(
        'put_object',
        Params={'Bucket': BUCKET, 'Key': s3_key},
        ExpiresIn=300
    )

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'documentId': document_id, 'uploadUrl': presigned_url})
    }