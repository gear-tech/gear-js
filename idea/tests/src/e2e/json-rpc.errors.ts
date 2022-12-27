import { expect } from 'chai';

import request, { invalidRequest } from './request';
import { Passed } from '../interfaces';

export async function errorMethodNotExist(genesis: string): Promise<Passed> {
  const notExistMethod = 'program.some';
  const response = await request(notExistMethod, { genesis, id: '0x00' });

  expect(response.error.message).to.equal('Method not found');
  expect(response.error.code).to.equal(-32601);

  return true;
}

export async function errorInvalidParams(genesis: string): Promise<Passed> {
  const response = await invalidRequest('program.all', { genesis });

  expect(response.error.message).to.equal('Invalid params');
  expect(response.error.code).to.equal(-32602);

  return true;
}

export async function errorNoGenesisFound(genesis: string): Promise<Passed> {
  const response = await request('program.all', { genesis: `__${genesis}__` });

  expect(response.error.message).to.equal('Genesis not found in the request');
  expect(response.error.code).to.equal(-32605);

  return true;
}

export async function errorProgramNotFound(genesis: string): Promise<Passed> {
  const invalidProgramAddress = '0x00';
  const response = await request('program.data', {
    genesis,
    id: invalidProgramAddress
  });

  expect(response.error.message).to.equal('Program not found');
  expect(response.error.code).to.equal(-32404);

  return true;
}

export async function errorMessageNotFound(genesis: string): Promise<Passed> {
  const invalidMessageId = '0x00';
  const response = await request('message.data', {
    genesis,
    id: invalidMessageId
  });

  expect(response.error.message).to.equal('Message not found');
  expect(response.error.code).to.equal(-32404);

  return true;
}

export async function errorInvalidMetaHex(genesis: string, programId: string, hex: string): Promise<Passed> {
  const response = await request('program.meta.add', {
    genesis,
    programId,
    metaHex: hex,
    name: '',
  });

  expect(response.error.message).to.equal('Invalid program meta hex');
  expect(response.error.code).to.equal(-32602);

  return true;
}

export async function errorMetaNotFound(genesis: string, programId: string): Promise<Passed> {
  const response = await request('program.meta.get', {
    genesis,
    id: programId,
  });

  expect(response.error.message).to.equal('Metadata not found');
  expect(response.error.code).to.equal(-32404);

  return true;
}
