import json
import boto3

dynamodb = boto3.resource(
    'dynamodb',
    region_name='ap-southeast-2'
)

table = dynamodb.Table('StudentRecords')


def lambda_handler(event, context):
    try:
        method = event.get('httpMethod', 'GET')

        if method == 'GET':
            response = table.scan()
            result = response['Items']

        elif method == 'POST':
            body = json.loads(event.get('body') or '{}')

            table.put_item(Item={
                'id': str(body['id']),
                'name': body['name'],
                'email': body['email'],
                'department': body['department'],
                'year': body['year']
            })

            result = {'message': 'Student added successfully'}

        elif method == 'PUT':
            body = json.loads(event.get('body') or '{}')

            table.update_item(
                Key={'id': str(body['id'])},
                UpdateExpression='SET #n=:n, email=:e, department=:d, #y=:y',
                ExpressionAttributeNames={
                    '#n': 'name',
                    '#y': 'year'
                },
                ExpressionAttributeValues={
                    ':n': body['name'],
                    ':e': body['email'],
                    ':d': body['department'],
                    ':y': body['year']
                }
            )

            result = {'message': 'Student updated successfully'}

        elif method == 'DELETE':
            body = json.loads(event.get('body') or '{}')

            table.delete_item(
                Key={'id': str(body['id'])}
            )

            result = {'message': 'Student deleted successfully'}

        else:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Invalid method'})
            }

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
                'Content-Type': 'application/json'
            },
            'body': json.dumps(result, default=str)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': str(e)})
        }
