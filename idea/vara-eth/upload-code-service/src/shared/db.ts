import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { Hash } from 'viem';
import { config } from '../config.js';
import { generateJobId } from '../util.js';
import type { DbRequest, JobStatus, RequestCodeValidationParams } from './types.js';

const TABLE = config.dynamoDbTable;

const client = new DynamoDBClient();
const db = DynamoDBDocumentClient.from(client);

export async function createRequest(data: RequestCodeValidationParams): Promise<string> {
  const jobId = generateJobId(data.codeId, data.blobHash);

  const item: DbRequest & { jobId: string } = {
    jobId,
    status: 'pending',
    codeId: data.codeId,
    blobHash: data.blobHash,
    code: data.code,
    sender: data.sender,
    signature: data.signature,
  };

  await db.send(new PutCommand({ TableName: TABLE, Item: item }));

  return jobId;
}

export async function requestExists(jobId: string): Promise<boolean> {
  const { Item } = await db.send(new GetCommand({ TableName: TABLE, Key: { jobId }, ProjectionExpression: 'jobId' }));
  return Item !== undefined;
}

export async function getStatus(
  jobId: string,
): Promise<{ jobId: string; status: JobStatus; transactionId?: string } | null> {
  const { Item } = await db.send(
    new GetCommand({
      TableName: TABLE,
      Key: { jobId },
      ProjectionExpression: 'jobId, #s, transactionId',
      ExpressionAttributeNames: { '#s': 'status' },
    }),
  );

  if (!Item) return null;

  return {
    jobId: Item.jobId,
    status: Item.status,
    ...(Item.transactionHash ? { transactionHash: Item.transactionHash } : {}),
  };
}

const TERMINAL_STATUSES: JobStatus[] = ['success', 'failed'];

export async function setStatus(jobId: string, status: JobStatus, transactionHash?: Hash): Promise<void> {
  let updateExpression = 'SET #s = :status';
  const expressionAttributeNames: Record<string, string> = { '#s': 'status' };
  const expressionAttributeValues: Record<string, string | Hash> = { ':status': status };
  if (transactionHash) {
    updateExpression += ', #t = :transactionHash';
    expressionAttributeNames['#t'] = 'transactionHash';
    expressionAttributeValues[':transactionHash'] = transactionHash;
  }
  if (TERMINAL_STATUSES.includes(status)) {
    updateExpression += ' REMOVE #c';
    expressionAttributeNames['#c'] = 'code';
  }
  await db.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { jobId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    }),
  );
}

export async function getRequest(jobId: string) {
  const { Item } = await db.send(
    new GetCommand({
      TableName: TABLE,
      Key: { jobId },
    }),
  );

  if (!Item) {
    throw new Error(`Request not found: ${jobId}`);
  }
  return Item as DbRequest;
}
