import { GearKeyring, getWasmMetadata, Hex } from '@gear-js/api';
import { u8aToHex } from '@polkadot/util';
import { expect } from 'chai';
import { readFileSync } from 'fs';
import request from './request';
import { IPreparedProgram, Passed } from '../interfaces';
import accounts from '../config/accounts';

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
    'initStatus',
  );
  expect(response.result.meta).to.have.all.keys('meta');
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
    metaFile: metaFile ? metaFile.toString('base64') : null,
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
  expect(response.result).to.have.all.keys('program', 'meta', 'metaFile');
  return true;
}
