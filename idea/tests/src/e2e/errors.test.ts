import { expect } from 'chai';
import { JSONRPC_ERRORS } from '@gear-js/common';

import request, { invalidRequest } from './request';
import { Passed } from '../interfaces';

export async function errorMethodNotExist(genesis: string): Promise<Passed> {
  const notExistMethod = 'program.some';
  const response = await request(notExistMethod, { genesis, id: '0x00' });

  expect(response.error.message).to.equal(JSONRPC_ERRORS.MethodNotFound.message);
  expect(response.error.code).to.equal(JSONRPC_ERRORS.MethodNotFound.code);

  return true;
}

export async function errorInvalidParams(genesis: string): Promise<Passed> {
  const response = await invalidRequest('program.all', { genesis });

  expect(response.error.message).to.equal(JSONRPC_ERRORS.InvalidParams.message);
  expect(response.error.code).to.equal(JSONRPC_ERRORS.InvalidParams.code);

  return true;
}

export async function errorNoGenesisFound(genesis: string): Promise<Passed> {
  const response = await request('program.all', { genesis: `__${genesis}__` });

  expect(response.error.message).to.equal(JSONRPC_ERRORS.NoGenesisFound.message);
  expect(response.error.code).to.equal(JSONRPC_ERRORS.NoGenesisFound.code);

  return true;
}

export async function errorProgramNotFound(genesis: string): Promise<Passed> {
  const invalidProgramAddress = '0x00';
  const response = await request('program.data', {
    genesis,
    id: invalidProgramAddress
  });

  expect(response.error.message).to.equal(JSONRPC_ERRORS.ProgramNotFound.message);
  expect(response.error.code).to.equal(JSONRPC_ERRORS.ProgramNotFound.code);

  return true;
}

export async function errorMessageNotFound(genesis: string): Promise<Passed> {
  const invalidMessageId = '0x00';
  const response = await request('message.data', {
    genesis,
    id: invalidMessageId
  });

  expect(response.error.message).to.equal(JSONRPC_ERRORS.MessageNotFound.message);
  expect(response.error.code).to.equal(JSONRPC_ERRORS.MessageNotFound.code);

  return true;
}
