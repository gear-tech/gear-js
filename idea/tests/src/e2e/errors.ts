import request from './request';
import assert from 'assert';
import { responseHasError } from './utils';

export async function errorGetProgramData(genesis: string) {
  const response = await request('program.data', { genesis, id: '0x00' });
  assert.ok(responseHasError(response));
  assert.deepEqual(response.error, { message: 'Program not found', code: -32404 });
}

export async function errorGetMessageData(genesis: string) {
  const response = await request('message.data', { genesis, id: '0x00' });
  assert.ok(responseHasError(response));
  assert.deepEqual(response.error, { message: 'Message not found', code: -32404 });
}

export async function errorGetMetadata(genesis: string) {
  const response = await request('message.data', { genesis, programId: '0x00' });
  assert.ok(responseHasError(response));
  assert.deepEqual(response.error, { message: 'Metadata not found', code: -32404 });
}
