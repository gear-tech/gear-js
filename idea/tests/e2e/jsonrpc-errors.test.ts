import { JSONRPC_ERRORS, IRpcRequest } from '@gear-js/common';
import { HexString, generateCodeHash } from '@gear-js/api';
import * as fs from 'fs';
import * as path from 'path';

import request, { invalidRequest, invalidBatchRequest } from './request';
import { PATH_TO_PROGRAMS } from './config';

const genesis = fs.readFileSync('./genesis', 'utf-8');
const hex = ('0x' + fs.readFileSync(path.join(PATH_TO_PROGRAMS, 'test_meta.meta.txt'), 'utf-8')) as HexString;
const hash = generateCodeHash(hex);

describe('jsonrpc errors', () => {
  test(JSONRPC_ERRORS.MethodNotFound.name, async () => {
    const response = await request('invalid.method', { genesis });
    expect(response).toHaveProperty('error.code', -32601);
    expect(response).toHaveProperty('error.message', 'Method not found');
  });

  test(JSONRPC_ERRORS.InvalidParams.name, async () => {
    const response = await invalidRequest('program.all', { genesis });
    expect(response).toHaveProperty('error.code', -32602);
    expect(response).toHaveProperty('error.message', 'Invalid params');
  });

  test(JSONRPC_ERRORS.NoGenesisFound.name, async () => {
    const response = await request('program.all', {});
    console.log(response);
    expect(response).toHaveProperty('error.code', -32605);
    expect(response).toHaveProperty('error.message', 'Genesis not found in the request');
  });

  test(JSONRPC_ERRORS.UnknownNetwork.name, async () => {
    const response = await request('program.all', { genesis: '0x1234' });
    expect(response).toHaveProperty('error.code', -32605);
    expect(response).toHaveProperty('error.message', 'Unknown network');
  });

  test(JSONRPC_ERRORS.ProgramNotFound.name, async () => {
    const response = await request('program.data', { genesis, id: '0x1234' });
    expect(response).toHaveProperty('error.code', -32404);
    expect(response).toHaveProperty('error.message', 'Program not found');
  });

  test(JSONRPC_ERRORS.CodeNotFound.name, async () => {
    const response = await request('code.data', { genesis, id: '0x1234' });
    expect(response).toHaveProperty('error.code', -32404);
    expect(response).toHaveProperty('error.message', 'Code not found');
  });

  test(JSONRPC_ERRORS.MessageNotFound.name, async () => {
    const response = await request('message.data', { genesis, id: '0x1234' });
    expect(response).toHaveProperty('error.code', -32404);
    expect(response).toHaveProperty('error.message', 'Message not found');
  });

  test(JSONRPC_ERRORS.MessageNotFound.name, async () => {
    const response = await request('meta.add', { hash, hex: '0x' });
    expect(response).toHaveProperty('error.code', -32602);
    expect(response).toHaveProperty('error.message', 'Invalid meta hex');
  });

  test(JSONRPC_ERRORS.MetadataNotFound.name, async () => {
    const response = await request('meta.get', { hash: '0x' });
    expect(response).toHaveProperty('error.code', -32404);
    expect(response).toHaveProperty('error.message', 'Metadata not found');
  });

  test('Invalid batch request with empty body', async () => {
    const invalidBatchRequestBody = [];

    const response = await invalidBatchRequest(invalidBatchRequestBody);
    expect(response[0]).toHaveProperty('error.code', -32600);
    expect(response[0]).toHaveProperty('error.message', 'Invalid Request');
  });

  test(`Invalid batch request with ${JSONRPC_ERRORS.InvalidRequest.name} 
  and ${JSONRPC_ERRORS.InvalidParams.name}`, async () => {
    const invalidBatchRequestBody = [1, {
      'jsonrpc': '2.0',
      'id': 'number',
      'params': {
        'genesis': '0x7ff5958c448d101263b727387b073b908022bc480fc43301e0e7140bec0e40d1'
      } 
    }] as any[];

    const response = await invalidBatchRequest(invalidBatchRequestBody);
    expect(response[0]).toHaveProperty('error.code', -32600);
    expect(response[0]).toHaveProperty('error.message', 'Invalid Request');

    expect(response[1]).toHaveProperty('error.code', -32602);
    expect(response[1]).toHaveProperty('error.message', 'Invalid params');
  });
});
