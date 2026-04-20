import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { verifyMessage } from 'viem/utils';

import { config } from './config.js';
import {
  validateBlobHash,
  validateCode,
  validateCodeId,
  validateSender,
  validateSignature,
} from './field-validator.js';
import { createRequest, getStatus as getJobStatus } from './shared/db.js';
import type { RequestCodeValidationParams } from './shared/types.js';
import { generateJobId } from './util.js';

const sqs = new SQSClient();

const FIELD_VALIDATORS: Record<keyof RequestCodeValidationParams, (data: unknown) => boolean> = {
  code: validateCode,
  codeId: validateCodeId,
  sender: validateSender,
  blobHash: validateBlobHash,
  signature: validateSignature,
};

const REQUIRED_FIELDS = Object.keys(FIELD_VALIDATORS) as (keyof RequestCodeValidationParams)[];

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const handler: APIGatewayProxyHandler = async (event) => {
  const { httpMethod, path } = event;

  try {
    if (httpMethod === 'POST' && path === '/request-code-validation') {
      return await requestCodeValidationHandler(event);
    }

    if (httpMethod === 'GET' && path === '/status') {
      return await statusHandler(event);
    }
  } catch (error) {
    console.error(error);
    return json(500, { error: 'Internal server error' });
  }

  return json(404, { error: 'Not found' });
};

const requestCodeValidationHandler = async (event: APIGatewayProxyEvent): Promise<ReturnType<typeof json>> => {
  let body: RequestCodeValidationParams;

  try {
    const parsed = JSON.parse(event.body ?? '');
    if (!parsed || typeof parsed !== 'object') throw new Error();
    body = parsed as RequestCodeValidationParams;
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const missing = REQUIRED_FIELDS.filter((field) => !body[field]);
  if (missing.length > 0) {
    return json(400, { error: `Missing required fields: ${missing.join(', ')}` });
  }

  for (const field of REQUIRED_FIELDS) {
    if (!FIELD_VALIDATORS[field](body[field])) {
      return json(400, { error: `Invalid field: ${field}` });
    }
  }

  // Validate signature — sender must have signed blobHash + codeId
  const isValid = await verifyMessage({
    address: body.sender,
    message: body.blobHash + body.codeId,
    signature: body.signature as `0x${string}`,
  });
  if (!isValid) {
    return json(401, { error: 'Invalid signature' });
  }

  const jobId = generateJobId(body.codeId, body.blobHash);
  const existing = await getJobStatus(jobId);
  if (existing && existing.status !== 'failed') {
    return json(200, { jobId, routerAddress: config.routerAddress });
  }

  // Write to DynamoDB with status: pending
  await createRequest(body);

  // Enqueue SQS message
  await sqs.send(
    new SendMessageCommand({
      QueueUrl: config.sqsQueueUrl,
      MessageBody: JSON.stringify({ jobId }),
    }),
  );

  return json(200, { jobId, routerAddress: config.routerAddress });
};

const statusHandler = async (event: APIGatewayProxyEvent): Promise<ReturnType<typeof json>> => {
  const jobId = event.queryStringParameters?.jobId;
  if (!jobId) {
    return json(400, { error: 'Missing jobId' });
  }

  const status = await getJobStatus(jobId);
  if (!status) {
    return json(404, { error: 'Not found' });
  }

  return json(200, status);
};
