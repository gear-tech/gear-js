import type { Address, Hash } from 'viem';

const assertEnv = <T>(envName: string) => {
  const value = process.env[envName];
  if (!value) {
    throw new Error(`Missing environment variable: ${envName}`);
  }
  return value as T;
};

export const config = {
  routerAddress: assertEnv<Address>('ROUTER_ADDRESS'),
  ethereumRpcUrl: assertEnv<string>('ETHEREUM_RPC_URL'),
  privateKey: assertEnv<Hash>('PRIVATE_KEY'),
  dynamoDbTable: assertEnv<string>('DYNAMODB_TABLE'),
  sqsQueueUrl: assertEnv<string>('SQS_QUEUE_URL'),
};
