import boto3

textract = boto3.client('textract')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('DocApproval-Documents')

def lambda_handler(event, context):
    record = event['Records'][0]
    bucket = record['s3']['bucket']['name']
    key = record['s3']['object']['key']

    response = textract.detect_document_text(
        Document={'S3Object': {'Bucket': bucket, 'Name': key}}
    )
    text = ' '.join([b['Text'] for b in response['Blocks'] if b['BlockType'] == 'LINE'])

    filename = key.split('/')[-1]
    document_id = filename.split('_')[0]

    table.update_item(
        Key={'documentId': document_id},
        UpdateExpression='SET extractedText = :t',
        ExpressionAttributeValues={':t': text[:2000]}
    )

