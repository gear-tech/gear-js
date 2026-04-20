# upload-code-service

Serverless service that accepts Vara.Eth code validation requests from users and submits them as Ethereum transactions. It serializes transaction submission through an SQS queue to avoid nonce conflicts.

## Architecture

```
POST /request-code-validation
        |
   handler Lambda          — validates request, verifies signature, writes job to DynamoDB, enqueues SQS message
        |                    returns { jobId, routerAddress }
     SQS queue             — serializes TX submission (batch-size=1, worker reserved-concurrency=1)
        |
   worker Lambda           — fetches job, calls requestCodeValidation on-chain, updates status
        |
      SQS DLQ              — receives messages that failed after 3 retries

GET /status?jobId=<jobId>
        |
   handler Lambda          — reads job status from DynamoDB
```

## Job lifecycle

`pending` → `processing` → `success` | `failed`

## API

### `POST /request-code-validation`

**Request body:**

| Field | Type | Description |
|---|---|---|
| `code` | `Hex` | WASM bytecode |
| `codeId` | `Hash` | blake2b-256 hash of the code |
| `sender` | `Address` | Ethereum address of the requester |
| `blobHash` | `Hash` | KZG blob versioned hash |
| `signature` | `Hex` | Signature over `blobHash + codeId` |

**Response:**

```json
{ "jobId": "...", "routerAddress": "0x..." }
```

Idempotent — submitting the same `codeId` + `blobHash` twice returns the existing `jobId`.

### `GET /status?jobId=<jobId>`

**Response:**

```json
{ "jobId": "...", "status": "pending|processing|success|failed", "transactionHash": "0x..." }
```

## Environment variables

| Variable | Description |
|---|---|
| `ROUTER_ADDRESS` | Vara.Eth router contract address |
| `ETHEREUM_RPC_URL` | Ethereum WebSocket RPC endpoint |
| `PRIVATE_KEY` | Private key of the account submitting transactions |
| `DYNAMODB_TABLE` | DynamoDB table name for job tracking |
| `SQS_QUEUE_URL` | SQS queue URL |

## Deployment

### 1. Provision AWS resources

Run the setup script to create all required resources from scratch:

```bash
AWS_REGION=eu-central-1 \
AWS_ACCOUNT_ID=<account-id> \
ROUTER_ADDRESS=0x... \
ETHEREUM_RPC_URL=wss://... \
PRIVATE_KEY=0x... \
  ./scripts/setup-aws.sh <environment>
```

This creates: IAM role, DynamoDB table, SQS queue + DLQ, handler and worker Lambda functions, API Gateway.

### 2. Subsequent deployments

Build and upload zips:

```bash
yarn workspace upload-code-service run build

aws lambda update-function-code --function-name <handler-function> \
  --zip-file fileb://dist/handler.zip --region <region>

aws lambda update-function-code --function-name <worker-function> \
  --zip-file fileb://dist/worker.zip --region <region>
```

Or trigger the GitHub Actions workflow (`release-vara-eth-idea.yml`).

### 3. Lambda configuration

| Function | Runtime | Handler | Memory | Timeout |
|---|---|---|---|---|
| handler | Node.js 22 | `handler.handler` | 128 MB | 30s |
| worker | Node.js 22 | `worker.handler` | 512 MB | 300s |

Worker requires 512 MB+ due to KZG WASM initialization (~70s on cold start at 512 MB).

### 4. Zip contents

The build script produces two zips:

- `dist/handler.zip` — `handler.js` only (self-contained bundle)
- `dist/worker.zip` — `worker.js` + `node_modules/kzg-wasm/dist/cjs/` + `node_modules/kzg-wasm/dist/wasm/` (WASM not bundled)

## Testing

Use the test script to send a real request:

```bash
PRIVATE_KEY=0x... node scripts/request-validation.mjs <wasm-file> <api-url>
```
