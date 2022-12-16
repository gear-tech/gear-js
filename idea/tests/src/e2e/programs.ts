import { getWasmMetadata, Hex } from '@gear-js/api';
import { u8aToHex } from '@polkadot/util';
import { expect } from 'chai';
import { readFileSync } from 'fs';

import request, { batchRequest } from './request';
import accounts from '../config/accounts';
import { IPreparedProgram, IPreparedPrograms, Passed } from '../interfaces';

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

export async function getAllProgramsByOwner(genesis: string, programs: IPreparedPrograms): Promise<Passed> {
  const keyList = Object.keys(programs);
  const owner = programs[keyList[0]].owner;

  const ownerList = Object.keys(programs)
    .map((key) => programs[key])
    .map((program) => program.owner);

  const response = await request('program.all', { genesis, owner });
  expect(response).to.have.own.property('result');
  expect(response.result.count).to.eq(keyList.length);

  response.result.programs
    .map((program: any) => program.owner)
    .forEach((programOwner: Hex) => {
      expect(ownerList).to.contains(programOwner);
    });
  return true;
}

export async function getAllProgramsByStatus(genesis: string, status: string): Promise<Passed> {
  const response = await request('program.all', { genesis, status });
  expect(response).to.have.own.property('result');

  response.result.programs
    .map((program: any) => program.status)
    .forEach((programStatus: string) => {
      expect(status).to.equal(programStatus);
    });
  return true;
}

export async function getAllProgramsByDates(genesis: string, date: Date): Promise<Passed> {
  const fromDate = new Date(date);
  fromDate.setMinutes(fromDate.getMinutes() - 5);

  const toDate = new Date(date);
  toDate.setMinutes(toDate.getMinutes() + 5);

  const response = await request('program.all', { genesis, fromDate, toDate });

  const isValidProgramsDate = response.result.programs.reduce((arr, program: any) => {
    const createdProgramDate = new Date(program.timestamp);
    if (createdProgramDate > fromDate && createdProgramDate < toDate) {
      arr.push(true);
    } else {
      arr.push(false);
    }

    return arr;
  }, []);

  expect(response).to.have.own.property('result');
  expect(isValidProgramsDate.every((el) => el === true)).to.equal(true);

  return true;
}

export async function getProgramData(genesis: string, programId: string): Promise<Passed> {
  const response = await request('program.data', { genesis, programId });
  expect(response).to.have.own.property('result');
  expect(response.result).to.have.all.keys(
    'id',
    '_id',
    'blockHash',
    'genesis',
    'owner',
    'name',
    'timestamp',
    'meta',
    'title',
    'status',
    'code',
    'messages',
    'expiration',
  );
  return true;
}

export async function getProgramDataInBatch(genesis: string, programId: string): Promise<Passed> {
  const response = await batchRequest('program.data', { genesis, programId });
  expect(Array.isArray(response)).ok;
  expect(response).to.have.length(1);
  expect(response[0]).to.have.own.property('result');
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
  expect(response.result.metaWasm).to.not.be.undefined;
  return true;
}

export async function checkInitStatus(genesis: string, programId: string, init: boolean) {
  const data = {
    genesis,
    id: programId,
  };
  const status = init ? 'active' : 'terminated';
  const response = await request('program.data', data);
  expect(response).to.have.property('result');

  expect(response.result.status).to.eq(status);
  return true;
}
