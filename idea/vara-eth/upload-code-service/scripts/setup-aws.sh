#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/setup-aws.sh <environment>
# Example: ./scripts/setup-aws.sh staging
#
# Required env vars:
#   AWS_REGION
#   AWS_ACCOUNT_ID
#   ROUTER_ADDRESS
#   ETHEREUM_RPC_URL
#   PRIVATE_KEY

ENVIRONMENT=${1:?Usage: $0 <environment>}

: "${AWS_REGION:?AWS_REGION is required}"
: "${AWS_ACCOUNT_ID:?AWS_ACCOUNT_ID is required}"
: "${ROUTER_ADDRESS:?ROUTER_ADDRESS is required}"
: "${ETHEREUM_RPC_URL:?ETHEREUM_RPC_URL is required}"
: "${PRIVATE_KEY:?PRIVATE_KEY is required}"

TABLE_NAME="upload-code-${ENVIRONMENT}"
QUEUE_NAME="upload-code-${ENVIRONMENT}"
DLQ_NAME="upload-code-${ENVIRONMENT}-dlq"
ROLE_NAME="upload-code-${ENVIRONMENT}-role"
HANDLER_FUNCTION="upload-code-handler-${ENVIRONMENT}"
WORKER_FUNCTION="upload-code-worker-${ENVIRONMENT}"

echo "=== Setting up upload-code-service (${ENVIRONMENT}) ==="

# IAM role
echo "--- Creating IAM role..."
aws iam create-role \
  --role-name "${ROLE_NAME}" \
  --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' \
  --query 'Role.Arn' --output text

ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:role/${ROLE_NAME}"
TABLE_ARN="arn:aws:dynamodb:${AWS_REGION}:${AWS_ACCOUNT_ID}:table/${TABLE_NAME}"
QUEUE_ARN="arn:aws:sqs:${AWS_REGION}:${AWS_ACCOUNT_ID}:${QUEUE_NAME}"

aws iam attach-role-policy --role-name "${ROLE_NAME}" \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam put-role-policy \
  --role-name "${ROLE_NAME}" \
  --policy-name "upload-code-${ENVIRONMENT}-policy" \
  --policy-document "{
    \"Version\": \"2012-10-17\",
    \"Statement\": [
      {
        \"Effect\": \"Allow\",
        \"Action\": [\"dynamodb:GetItem\", \"dynamodb:PutItem\", \"dynamodb:UpdateItem\"],
        \"Resource\": \"${TABLE_ARN}\"
      },
      {
        \"Effect\": \"Allow\",
        \"Action\": [\"sqs:SendMessage\", \"sqs:ReceiveMessage\", \"sqs:DeleteMessage\", \"sqs:GetQueueAttributes\"],
        \"Resource\": \"${QUEUE_ARN}\"
      }
    ]
  }"

echo "Waiting for role to propagate..."
sleep 10

# DynamoDB
echo "--- Creating DynamoDB table..."
aws dynamodb create-table \
  --table-name "${TABLE_NAME}" \
  --attribute-definitions AttributeName=jobId,AttributeType=S \
  --key-schema AttributeName=jobId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region "${AWS_REGION}"

# SQS DLQ
echo "--- Creating DLQ..."
DLQ_URL=$(aws sqs create-queue \
  --queue-name "${DLQ_NAME}" \
  --region "${AWS_REGION}" \
  --query 'QueueUrl' --output text)

DLQ_ARN=$(aws sqs get-queue-attributes \
  --queue-url "${DLQ_URL}" \
  --attribute-names QueueArn \
  --region "${AWS_REGION}" \
  --query 'Attributes.QueueArn' --output text)

# SQS main queue
echo "--- Creating SQS queue..."
QUEUE_URL=$(aws sqs create-queue \
  --queue-name "${QUEUE_NAME}" \
  --attributes "VisibilityTimeout=300,RedrivePolicy={\"deadLetterTargetArn\":\"${DLQ_ARN}\",\"maxReceiveCount\":\"3\"}" \
  --region "${AWS_REGION}" \
  --query 'QueueUrl' --output text)

QUEUE_ARN=$(aws sqs get-queue-attributes \
  --queue-url "${QUEUE_URL}" \
  --attribute-names QueueArn \
  --region "${AWS_REGION}" \
  --query 'Attributes.QueueArn' --output text)

# Build
echo "--- Building..."
yarn workspace upload-code-service run build

# Handler Lambda
echo "--- Creating handler Lambda..."
aws lambda create-function \
  --function-name "${HANDLER_FUNCTION}" \
  --runtime nodejs22.x \
  --role "${ROLE_ARN}" \
  --handler handler.handler \
  --zip-file fileb://idea/vara-eth/upload-code-service/dist/handler.zip \
  --region "${AWS_REGION}" \
  --environment "Variables={ROUTER_ADDRESS=${ROUTER_ADDRESS},ETHEREUM_RPC_URL=${ETHEREUM_RPC_URL},PRIVATE_KEY=${PRIVATE_KEY},DYNAMODB_TABLE=${TABLE_NAME},SQS_QUEUE_URL=${QUEUE_URL}}"

# Worker Lambda
echo "--- Creating worker Lambda..."
aws lambda create-function \
  --function-name "${WORKER_FUNCTION}" \
  --runtime nodejs22.x \
  --role "${ROLE_ARN}" \
  --handler worker.handler \
  --zip-file fileb://idea/vara-eth/upload-code-service/dist/worker.zip \
  --timeout 300 \
  --memory-size 512 \
  --region "${AWS_REGION}" \
  --environment "Variables={ROUTER_ADDRESS=${ROUTER_ADDRESS},ETHEREUM_RPC_URL=${ETHEREUM_RPC_URL},PRIVATE_KEY=${PRIVATE_KEY},DYNAMODB_TABLE=${TABLE_NAME},SQS_QUEUE_URL=${QUEUE_URL}}"

# SQS trigger on worker
echo "--- Attaching SQS trigger to worker..."
aws lambda create-event-source-mapping \
  --function-name "${WORKER_FUNCTION}" \
  --event-source-arn "${QUEUE_ARN}" \
  --batch-size 1 \
  --region "${AWS_REGION}"

# API Gateway
echo "--- Creating API Gateway..."
API_ID=$(aws apigateway create-rest-api \
  --name "upload-code-${ENVIRONMENT}" \
  --region "${AWS_REGION}" \
  --query 'id' --output text)

ROOT_ID=$(aws apigateway get-resources \
  --rest-api-id "${API_ID}" \
  --region "${AWS_REGION}" \
  --query 'items[0].id' --output text)

HANDLER_ARN="arn:aws:lambda:${AWS_REGION}:${AWS_ACCOUNT_ID}:function:${HANDLER_FUNCTION}"
INTEGRATION_URI="arn:aws:apigateway:${AWS_REGION}:lambda:path/2015-03-31/functions/${HANDLER_ARN}/invocations"

create_lambda_route() {
  local path=$1
  local method=$2

  RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id "${API_ID}" \
    --parent-id "${ROOT_ID}" \
    --path-part "${path}" \
    --region "${AWS_REGION}" \
    --query 'id' --output text)

  aws apigateway put-method \
    --rest-api-id "${API_ID}" \
    --resource-id "${RESOURCE_ID}" \
    --http-method "${method}" \
    --authorization-type NONE \
    --region "${AWS_REGION}"

  aws apigateway put-integration \
    --rest-api-id "${API_ID}" \
    --resource-id "${RESOURCE_ID}" \
    --http-method "${method}" \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "${INTEGRATION_URI}" \
    --region "${AWS_REGION}"
}

create_lambda_route "request-code-validation" "POST"
create_lambda_route "status" "GET"

aws apigateway create-deployment \
  --rest-api-id "${API_ID}" \
  --stage-name "${ENVIRONMENT}" \
  --region "${AWS_REGION}"

echo "--- Configuring API Gateway throttling..."
aws apigateway update-stage \
  --rest-api-id "${API_ID}" \
  --stage-name "${ENVIRONMENT}" \
  --patch-operations \
    op=replace,path=/defaultRouteSettings/throttlingRateLimit,value=1 \
    op=replace,path=/defaultRouteSettings/throttlingBurstLimit,value=10 \
  --region "${AWS_REGION}"

aws lambda add-permission \
  --function-name "${HANDLER_FUNCTION}" \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --region "${AWS_REGION}"

echo ""
echo "=== Done ==="
echo "API URL: https://${API_ID}.execute-api.${AWS_REGION}.amazonaws.com/${ENVIRONMENT}"
echo "Handler: ${HANDLER_FUNCTION}"
echo "Worker:  ${WORKER_FUNCTION}"
echo "Table:   ${TABLE_NAME}"
echo "Queue:   ${QUEUE_URL}"
