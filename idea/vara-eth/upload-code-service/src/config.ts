import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import type { Address, Hash } from 'viem';

const assertEnv = <T>(envName: string) => {
  const value = process.env[envName];
  if (!value) {
    throw new Error(`Missing environment variable: ${envName}`);
  }
  return value as T;
};

const secretsManager = new SecretsManagerClient();

async function fetchPrivateKey(): Promise<Hash> {
  const secretArn = assertEnv<string>('PRIVATE_KEY_SECRET_ARN');
  const { SecretString } = await secretsManager.send(new GetSecretValueCommand({ SecretId: secretArn }));
  if (!SecretString) throw new Error('PRIVATE_KEY secret is empty');
  return SecretString as Hash;
}

let _config: Awaited<ReturnType<typeof buildConfig>> | null = null;

async function buildConfig() {
  return {
    routerAddress: assertEnv<Address>('ROUTER_ADDRESS'),
    ethereumRpcUrl: assertEnv<string>('ETHEREUM_RPC_URL'),
    privateKey: await fetchPrivateKey(),
    dynamoDbTable: assertEnv<string>('DYNAMODB_TABLE'),
    sqsQueueUrl: assertEnv<string>('SQS_QUEUE_URL'),
  };
}

export async function getConfig() {
  if (!_config) {
    _config = await buildConfig();
  }
  return _config;
}
