import request from './request';
import assert from 'assert';

export async function errorGetProgramData(genesis: string) {
  const response = await request('program.data', { genesis, id: '0x00' });
  assert.ok(Object.keys(response).includes('error'));
  assert.deepEqual(response.error, { message: 'Program not found', code: -32404 });
}
