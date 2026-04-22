import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { getConfig } from './config.js';
import {
  validateBlobHashes,
  validateCode,
  validateCodeId,
  validateDeadline,
  validateR,
  validateS,
  validateSender,
  validateV,
} from './field-validator.js';
import { createRequest, getStatus as getJobStatus } from './shared/db.js';
import type { RequestCodeValidationParams } from './shared/types.js';
import { generateJobId } from './util.js';

const sqs = new SQSClient();

const FIELD_VALIDATORS: Record<keyof RequestCodeValidationParams, (data: unknown) => boolean> = {
  code: validateCode,
  codeId: validateCodeId,
  sender: validateSender,
  blobHashes: validateBlobHashes,
  deadline: validateDeadline,
  v1: validateV,
  r1: validateR,
  s1: validateS,
  v2: validateV,
  r2: validateR,
  s2: validateS,
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

  const missing = REQUIRED_FIELDS.filter((field) => body[field] === undefined || body[field] === null);
  if (missing.length > 0) {
    return json(400, { error: `Missing required fields: ${missing.join(', ')}` });
  }

  for (const field of REQUIRED_FIELDS) {
    if (!FIELD_VALIDATORS[field](body[field])) {
      return json(400, { error: `Invalid field: ${field}` });
    }
  }

  const jobId = generateJobId(body.codeId);
  const [existing, config] = await Promise.all([getJobStatus(jobId), getConfig()]);
  if (existing && existing.status !== 'failed') {
    return json(200, { jobId, routerAddress: config.routerAddress });
  }

  await createRequest(body);

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
