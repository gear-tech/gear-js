import { Hex } from '@gear-js/api';
import { expect } from 'chai';
import { readFileSync } from 'fs';

import request, { batchRequest } from './request';
import { IPreparedProgram, IPreparedPrograms, Passed } from '../interfaces';
import { HexString } from '@polkadot/util/types';

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
  const metaHex: HexString = `0x${readFileSync(program.spec.pathToMetaTxt, 'utf-8')}`;

  const data = {
    genesis,
    programId: program.id,
    metaHex,
    name: program.spec.name,
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
  expect(response.result).to.have.all.keys('types', 'hex');
  expect(response.result.hex).to.not.be.undefined;
  expect(response.result.types).to.not.be.undefined;
  return true;
}

export async function addState(genesis: string, program: IPreparedProgram): Promise<Passed> {
  const n = program.spec.pathToMetaState.lastIndexOf('/');
  const nameFile = program.spec.pathToMetaState.substring(n + 1);

  const metaBuff = readFileSync(program.spec.pathToMetaState);
  const metaStateBuffBase64 = metaBuff.toString('base64');

  const data = {
    genesis,
    wasmBuffBase64: metaStateBuffBase64,
    programId: program.id,
    name: nameFile,
  };

  const response = await request('program.state.add', data);
  expect(response).to.have.property('result');
  expect(response.result).to.have.property('status');
  expect(response.result.status).to.eq('State added');
  return true;
}

export async function getStates(genesis: string, program: IPreparedProgram): Promise<Passed> {

  const data = {
    genesis,
    programId: program.id,
  };

  const response = await request('program.state.all', data);
  expect(response).to.have.property('result');

  return true;
}

export async function getState(genesis: string, program: IPreparedProgram): Promise<Passed> {

  const data = {
    genesis
  };

  const response = await request('program.state.get', data);
  expect(response).to.have.property('result');
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
