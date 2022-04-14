import request from './request';
import assert from 'assert';
import { Hex } from '@gear-js/api';
import { responseHasResult } from './utils';

export async function getAllPrograms(genesis: string, expected: Hex[]) {
  const response = await request('program.all', { genesis });
  assert.ok(responseHasResult(response));
  assert.equal(response.result.count, expected.length);

  response.result.programs
    .map((program) => program.id)
    .forEach((programId) => {
      assert.ok(expected.includes(programId));
    });
}

export async function getProgramData(genesis: string, programId: string) {
  const response = await request('program.data', { genesis, programId });
  assert.ok(response);
}
