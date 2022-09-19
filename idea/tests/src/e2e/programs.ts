import { getWasmMetadata, Hex } from '@gear-js/api';
import { u8aToHex } from '@polkadot/util';
import { expect } from 'chai';
import { readFileSync } from 'fs';

import request from './request';
import accounts from '../config/accounts';
import { IPreparedProgram, Passed } from '../interfaces';

export async function getAllPrograms(genesis: string, expected: Hex[]): Promise<Passed> {
  const response = await request('program.all', { genesis });
  expect(response).to.have.own.property('result');
  expect(response.result.count).to.eq(expected.length);

  response.result.programs
    .map((program: any) => program.id)
    .forEach((programId: Hex) => {
      expect(expected).to.contains(programId);
    });
  return true;
}

export async function getProgramData(genesis: string, programId: string): Promise<Passed> {
  const response = await request('program.data', { genesis, programId });
  expect(response).to.have.own.property('result');
  expect(response.result).to.have.all.keys(
    'id',
    'blockHash',
    'genesis',
    'owner',
    'name',
    'timestamp',
    'meta',
    'title',
    'status',
    'code',
    'messages'
  );
  return true;

}

export async function uploadMeta(genesis: string, program: IPreparedProgram): Promise<Passed> {
  const accs = await accounts();
  const metaFile = program.spec.pathToMeta ? readFileSync(program.spec.pathToMeta) : null;
  const meta = metaFile ? JSON.stringify(await getWasmMetadata(metaFile)) : null;
  const data = {
    genesis,
    programId: program.id,
    meta,
    metaWasm: metaFile ? metaFile.toString('base64') : null,
    name: program.spec.name,
    title: `Test ${program.spec.name}`,
    signature: u8aToHex(accs[program.spec.account].sign(meta)),
  };
  const response = await request('program.meta.add', data);
  expect(response).to.have.property('result');
  expect(response.result).to.have.property('status');
  expect(response.result.status).to.eq('Metadata added');
  return true;
}

export async function getMeta(genesis: string, programId: string): Promise<Passed> {
  const data = {
    genesis,
    programId,
  };
  const response = await request('program.meta.get', data);
  expect(response).to.have.property('result');
  expect(response.result).to.have.all.keys('program', 'meta', 'metaWasm');
  return true;
}

export async function checkInitStatus(genesis: string, programId: string, init: boolean) {
  const data = {
    genesis,
    id: programId,
  };
  const status = init ? 'active' : 'init_failed';
  const response = await request('program.data', data);
  expect(response).to.have.property('result');

  expect(response.result.status).to.eq(status);
  return true;
}
