import json, boto3

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('DocApproval-Documents')
sns = boto3.client('sns')
BUCKET = 'docapproval-serverless'
TOPIC_ARN = 'arn:aws:sns:us-east-1:325657596731:docapproval-notifications'

def lambda_handler(event, context):
    claims = event.get('requestContext', {}).get('authorizer', {}).get('jwt', {}).get('claims', {})
    groups = claims.get('cognito:groups', '')
    if 'Admin' not in groups:
        return {
            'statusCode': 403,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Admins only'})
        }

    body = json.loads(event['body'])
    document_id = body['documentId']
    action = body['action']

    item = table.get_item(Key={'documentId': document_id})['Item']
    old_key = item['s3Key']
    filename = old_key.split('/')[-1]
    new_key = f"{action}/{filename}"

    s3.copy_object(Bucket=BUCKET, CopySource={'Bucket': BUCKET, 'Key': old_key}, Key=new_key)
    s3.delete_object(Bucket=BUCKET, Key=old_key)

    table.update_item(
        Key={'documentId': document_id},
        UpdateExpression='SET #s = :status, s3Key = :key',
        ExpressionAttributeNames={'#s': 'status'},
        ExpressionAttributeValues={':status': action, ':key': new_key}
    )

    sns.publish(
        TopicArn=TOPIC_ARN,
        Message=f"Document '{item['title']}' has been {action}.",
        Subject=f"Document {action.capitalize()}"
    )

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'status': action})
    }