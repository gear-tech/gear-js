import { HexString } from '@polkadot/util/types';
import { expect } from 'chai';
import { readFileSync } from 'fs';

import request, { batchRequest } from './request';
import { IPreparedProgram, IPreparedPrograms, IState, Passed } from '../interfaces';

export const mapProgramStates = new Map<string, IState[]>();
export const mapProgramsMetaHash = new Map<string, string>();

export async function getAllPrograms(genesis: string, expected: HexString[]): Promise<Passed> {
  const response = await request('program.all', { genesis });
  expect(response).to.have.own.property('result');
  expect(response.result.count).to.eq(expected.length);

  response.result.programs
    .map((program: any) => program.id)
    .forEach((programId: HexString) => {
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
    .forEach((programOwner: HexString) => {
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

export async function getProgramData(genesis: string, id: string): Promise<Passed> {
  const response = await request('program.data', { genesis, id });
  expect(response).to.have.own.property('result');
  expect(response.result).to.have.all.keys(
    'id',
    '_id',
    'blockHash',
    'genesis',
    'owner',
    'name',
    'timestamp',
    'metaHash',
    'status',
    'code',
    'messages',
    'expiration',
  );
  mapProgramsMetaHash.set(id, response.result.metaHash);
  return true;
}

export async function getProgramDataInBatch(genesis: string, programId: string): Promise<Passed> {
  const response = await batchRequest('program.data', { genesis, id: programId });
  expect(Array.isArray(response)).ok;
  expect(response).to.have.length(1);
  expect(response[0]).to.have.own.property('result');
  return true;
}

export async function uploadMeta(genesis: string, program: IPreparedProgram): Promise<Passed> {
  const metaHex: HexString = `0x${readFileSync(program.spec.pathToMetaTxt, 'utf-8')}`;

  const data = {
    genesis,
    hex: metaHex,
  };

  const response = await request('meta.add', data);
  expect(response).to.have.property('result');
  expect(response.result).to.have.all.keys('types', 'hex', 'id');
  expect(response.result.id).to.not.be.undefined;
  expect(response.result.hex).to.not.be.undefined;
  expect(response.result.types).to.not.be.undefined;
  return true;
}

export async function addProgramName(genesis: string, program: IPreparedProgram): Promise<Passed> {
  const data = {
    genesis,
    id: program.id,
    name: program.spec.name,
  };
  const response = await request('program.name.add', data);

  expect(response).to.have.property('result');
  expect(response.result).to.have.all.keys(
    'id',
    '_id',
    'blockHash',
    'genesis',
    'owner',
    'name',
    'timestamp',
    'meta',
    'status',
    'code',
    'expiration',
  );
  expect(response.result.name).to.eq(program.spec.name);
  return true;
}

export async function getMeta(genesis: string, hash: string): Promise<Passed> {
  const data = {
    genesis,
    hash,
  };
  const response = await request('meta.get', data);
  expect(response).to.have.property('result');
  expect(response.result).to.have.all.keys('types', 'hex', 'id');
  expect(response.result.id).to.not.be.undefined;
  expect(response.result.hex).to.not.be.undefined;
  expect(response.result.types).to.not.be.undefined;
  return true;
}

export async function addState(genesis: string, program: IPreparedProgram, statePath: string): Promise<Passed> {
  const n = statePath.lastIndexOf('/');
  const nameFile = statePath.substring(n + 1);

  const metaBuff = readFileSync(statePath);
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
  expect(response.result).to.have.property('state');
  expect(response.result.status).to.eq('State added');
  expect(response.result.state).to.have.all.keys('id', 'name', 'wasmBuffBase64', 'functions');

  return true;
}

export async function getStates(genesis: string, program: IPreparedProgram): Promise<Passed> {
  const data = {
    genesis,
    programId: program.id,
  };

  const response = await request('program.state.all', data);
  expect(response).to.have.property('result');
  expect(response.result.count).to.equal(program.spec.pathStates.length);

  if (response.result.count >= 1) {
    mapProgramStates.set(program.id, response.result.states as IState[]);
  }

  return true;
}

export async function getStatesByFuncName(genesis: string, program: IPreparedProgram, query: string): Promise<Passed> {
  const data = {
    genesis,
    programId: program.id,
    query,
  };

  const response = await request('program.state.all', data);
  const funcNames = Object.keys(response.result.states[0].functions);

  expect(response).to.have.property('result');
  expect(true).to.equal(funcNames.includes(query));

  return true;
}

export async function getState(genesis: string, state: IState): Promise<Passed> {
  const data = {
    genesis,
    id: state.id,
  };

  const response = await request('state.get', data);
  expect(response).to.have.property('result');
  expect(response.result.functions).to.have.all.keys(state.functions);
  return true;
}

export async function checkInitStatus(genesis: string, id: string, init: boolean) {
  const data = {
    genesis,
    id,
  };
  const status = init ? 'active' : 'terminated';
  const response = await request('program.data', data);
  expect(response).to.have.property('result');

  expect(response.result.status).to.eq(status);
  return true;
}
