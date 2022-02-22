import request from './request';
import assert from 'assert';
import { Hex } from '@gear-js/api';

export async function getAllPrograms(genesis: string, expected: Hex[]) {
  const response = await request('program.all', { genesis });
  assert.equal(response.count, expected.length);
  assert.deepEqual(
    response.programs.map((program) => program.id),
    expected,
  );
}
