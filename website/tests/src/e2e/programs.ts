import request from './request';
import assert from 'assert';
import { Hex } from '@gear-js/api';

export async function getAllPrograms(genesis: string, expected: Hex[]) {
  const response = await request('program.all', { genesis });
  assert.equal(response.count, expected.length);

  response.programs
    .map((program) => program.id)
    .forEach((programId) => {
      assert.ok(expected.includes(programId));
    });
}

export async function getProgramData(genesis: string, programId: string) {
  const response = await request('program.data', { genesis, programId });
  assert.ok(response);
}
