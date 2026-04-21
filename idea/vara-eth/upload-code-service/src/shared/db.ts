import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { Hash } from 'viem';
import { generateJobId } from '../util.js';
import type { DbRequest, JobStatus, RequestCodeValidationParams } from './types.js';

const TABLE = process.env.DYNAMODB_TABLE!;

const client = new DynamoDBClient();
const db = DynamoDBDocumentClient.from(client);

export async function createRequest(data: RequestCodeValidationParams): Promise<string> {
  const jobId = generateJobId(data.codeId);

  const item: DbRequest & { jobId: string } = {
    jobId,
    status: 'pending',
    codeId: data.codeId,
    blobHashes: data.blobHashes,
    deadline: data.deadline,
    code: data.code,
    sender: data.sender,
    v1: data.v1,
    r1: data.r1,
    s1: data.s1,
    v2: data.v2,
    r2: data.r2,
    s2: data.s2,
  };

  await db.send(new PutCommand({ TableName: TABLE, Item: item }));

  return jobId;
}


export async function getStatus(
  jobId: string,
): Promise<{ jobId: string; status: JobStatus; transactionHash?: string } | null> {
  const { Item } = await db.send(
    new GetCommand({
      TableName: TABLE,
      Key: { jobId },
      ProjectionExpression: 'jobId, #s, transactionHash',
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

export async function setStatus(jobId: string, status: JobStatus, transactionHash?: Hash): Promise<void> {
  let updateExpression = 'SET #s = :status';
  const expressionAttributeNames: Record<string, string> = { '#s': 'status' };
  const expressionAttributeValues: Record<string, string | Hash> = { ':status': status };
  if (transactionHash) {
    updateExpression += ', #t = :transactionHash';
    expressionAttributeNames['#t'] = 'transactionHash';
    expressionAttributeValues[':transactionHash'] = transactionHash;
  }
  if (status === 'success') {
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
