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
SECRET_NAME="upload-code-${ENVIRONMENT}/private-key"

ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:role/${ROLE_NAME}"
TABLE_ARN="arn:aws:dynamodb:${AWS_REGION}:${AWS_ACCOUNT_ID}:table/${TABLE_NAME}"

echo "=== Setting up upload-code-service (${ENVIRONMENT}) ==="

# IAM role
echo "--- Creating IAM role..."
if aws iam get-role --role-name "${ROLE_NAME}" --query 'Role.Arn' --output text 2>/dev/null; then
  echo "    Role already exists, skipping."
else
  aws iam create-role \
    --role-name "${ROLE_NAME}" \
    --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' \
    --query 'Role.Arn' --output text
fi

# Secrets Manager
echo "--- Storing private key in Secrets Manager..."
SECRET_ARN=$(aws secretsmanager describe-secret \
  --secret-id "${SECRET_NAME}" \
  --region "${AWS_REGION}" \
  --query 'ARN' --output text 2>/dev/null || true)

if [ -n "${SECRET_ARN}" ]; then
  echo "    Secret already exists, updating value..."
  aws secretsmanager put-secret-value \
    --secret-id "${SECRET_NAME}" \
    --secret-string "${PRIVATE_KEY}" \
    --region "${AWS_REGION}" > /dev/null
else
  SECRET_ARN=$(aws secretsmanager create-secret \
    --name "${SECRET_NAME}" \
    --secret-string "${PRIVATE_KEY}" \
    --region "${AWS_REGION}" \
    --query 'ARN' --output text)
fi

# IAM policies (put-role-policy is idempotent)
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
        \"Resource\": \"arn:aws:sqs:${AWS_REGION}:${AWS_ACCOUNT_ID}:${QUEUE_NAME}\"
      },
      {
        \"Effect\": \"Allow\",
        \"Action\": \"secretsmanager:GetSecretValue\",
        \"Resource\": \"${SECRET_ARN}\"
      }
    ]
  }"

echo "Waiting for role to propagate..."
sleep 10

# DynamoDB
echo "--- Creating DynamoDB table..."
if aws dynamodb describe-table --table-name "${TABLE_NAME}" --region "${AWS_REGION}" --query 'Table.TableName' --output text 2>/dev/null; then
  echo "    Table already exists, skipping."
else
  aws dynamodb create-table \
    --table-name "${TABLE_NAME}" \
    --attribute-definitions AttributeName=jobId,AttributeType=S \
    --key-schema AttributeName=jobId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region "${AWS_REGION}"
fi

# SQS DLQ (create-queue is idempotent for standard queues with same attributes)
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

# SQS main queue (create-queue is idempotent for standard queues with same attributes)
echo "--- Creating SQS queue..."
QUEUE_URL=$(aws sqs create-queue \
  --region "${AWS_REGION}" \
  --query 'QueueUrl' --output text \
  --cli-input-json "{\"QueueName\":\"${QUEUE_NAME}\",\"Attributes\":{\"VisibilityTimeout\":\"300\",\"RedrivePolicy\":\"{\\\"deadLetterTargetArn\\\":\\\"${DLQ_ARN}\\\",\\\"maxReceiveCount\\\":\\\"3\\\"}\"}}")

QUEUE_ARN=$(aws sqs get-queue-attributes \
  --queue-url "${QUEUE_URL}" \
  --attribute-names QueueArn \
  --region "${AWS_REGION}" \
  --query 'Attributes.QueueArn' --output text)

LAMBDA_ENV="Variables={ROUTER_ADDRESS=${ROUTER_ADDRESS},ETHEREUM_RPC_URL=${ETHEREUM_RPC_URL},PRIVATE_KEY_SECRET_ARN=${SECRET_ARN},DYNAMODB_TABLE=${TABLE_NAME},SQS_QUEUE_URL=${QUEUE_URL}}"

# Build
echo "--- Building..."
yarn workspace upload-code-service run build

# Handler Lambda
echo "--- Deploying handler Lambda..."
if aws lambda get-function --function-name "${HANDLER_FUNCTION}" --region "${AWS_REGION}" --query 'Configuration.FunctionName' --output text 2>/dev/null; then
  echo "    Function exists, updating code and config..."
  aws lambda update-function-code \
    --function-name "${HANDLER_FUNCTION}" \
    --zip-file fileb://idea/vara-eth/upload-code-service/dist/handler.zip \
    --region "${AWS_REGION}" > /dev/null
  aws lambda wait function-updated --function-name "${HANDLER_FUNCTION}" --region "${AWS_REGION}"
  aws lambda update-function-configuration \
    --function-name "${HANDLER_FUNCTION}" \
    --environment "${LAMBDA_ENV}" \
    --region "${AWS_REGION}" > /dev/null
else
  aws lambda create-function \
    --function-name "${HANDLER_FUNCTION}" \
    --runtime nodejs22.x \
    --role "${ROLE_ARN}" \
    --handler handler.handler \
    --zip-file fileb://idea/vara-eth/upload-code-service/dist/handler.zip \
    --region "${AWS_REGION}" \
    --environment "${LAMBDA_ENV}"
fi

# Worker Lambda
echo "--- Deploying worker Lambda..."
if aws lambda get-function --function-name "${WORKER_FUNCTION}" --region "${AWS_REGION}" --query 'Configuration.FunctionName' --output text 2>/dev/null; then
  echo "    Function exists, updating code and config..."
  aws lambda update-function-code \
    --function-name "${WORKER_FUNCTION}" \
    --zip-file fileb://idea/vara-eth/upload-code-service/dist/worker.zip \
    --region "${AWS_REGION}" > /dev/null
  aws lambda wait function-updated --function-name "${WORKER_FUNCTION}" --region "${AWS_REGION}"
  aws lambda update-function-configuration \
    --function-name "${WORKER_FUNCTION}" \
    --environment "${LAMBDA_ENV}" \
    --region "${AWS_REGION}" > /dev/null
else
  aws lambda create-function \
    --function-name "${WORKER_FUNCTION}" \
    --runtime nodejs22.x \
    --role "${ROLE_ARN}" \
    --handler worker.handler \
    --zip-file fileb://idea/vara-eth/upload-code-service/dist/worker.zip \
    --timeout 300 \
    --memory-size 512 \
    --region "${AWS_REGION}" \
    --environment "${LAMBDA_ENV}"
fi

# SQS trigger on worker
echo "--- Attaching SQS trigger to worker..."
MAPPING_UUID=$(aws lambda list-event-source-mappings \
  --function-name "${WORKER_FUNCTION}" \
  --event-source-arn "${QUEUE_ARN}" \
  --region "${AWS_REGION}" \
  --query 'EventSourceMappings[0].UUID' --output text 2>/dev/null || true)

if [ "${MAPPING_UUID}" != "None" ] && [ -n "${MAPPING_UUID}" ]; then
  echo "    Event source mapping already exists, skipping."
else
  aws lambda create-event-source-mapping \
    --function-name "${WORKER_FUNCTION}" \
    --event-source-arn "${QUEUE_ARN}" \
    --batch-size 1 \
    --region "${AWS_REGION}"
fi

# API Gateway
echo "--- Setting up API Gateway..."
API_ID=$(aws apigateway get-rest-apis \
  --region "${AWS_REGION}" \
  --query "items[?name=='upload-code-${ENVIRONMENT}'].id | [0]" --output text 2>/dev/null || true)

HANDLER_ARN="arn:aws:lambda:${AWS_REGION}:${AWS_ACCOUNT_ID}:function:${HANDLER_FUNCTION}"
INTEGRATION_URI="arn:aws:apigateway:${AWS_REGION}:lambda:path/2015-03-31/functions/${HANDLER_ARN}/invocations"

if [ "${API_ID}" != "None" ] && [ -n "${API_ID}" ]; then
  echo "    API Gateway already exists (${API_ID}), skipping creation."
else
  API_ID=$(aws apigateway create-rest-api \
    --name "upload-code-${ENVIRONMENT}" \
    --region "${AWS_REGION}" \
    --query 'id' --output text)

  ROOT_ID=$(aws apigateway get-resources \
    --rest-api-id "${API_ID}" \
    --region "${AWS_REGION}" \
    --query 'items[0].id' --output text)

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
      op=replace,path=/*/*/throttling/rateLimit,value=1 \
      op=replace,path=/*/*/throttling/burstLimit,value=10 \
    --region "${AWS_REGION}"

  aws lambda add-permission \
    --function-name "${HANDLER_FUNCTION}" \
    --statement-id apigateway-invoke \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --region "${AWS_REGION}"
fi

echo ""
echo "=== Done ==="
echo "API URL: https://${API_ID}.execute-api.${AWS_REGION}.amazonaws.com/${ENVIRONMENT}"
echo "Handler: ${HANDLER_FUNCTION}"
echo "Worker:  ${WORKER_FUNCTION}"
echo "Table:   ${TABLE_NAME}"
echo "Queue:   ${QUEUE_URL}"
