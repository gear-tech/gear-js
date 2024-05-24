import { JSONRPC_ERRORS } from '@gear-js/common';
import { HexString, generateCodeHash } from '@gear-js/api';
import * as fs from 'fs';
import * as path from 'path';

import { baseRequest, jsonrpcRequest } from './request';
import { PATH_TO_PROGRAMS } from './config';

const genesis = fs.readFileSync('./genesis', 'utf-8');
const hex = ('0x' + fs.readFileSync(path.join(PATH_TO_PROGRAMS, 'test_meta.meta.txt'), 'utf-8')) as HexString;
const hash = generateCodeHash(hex).replace('2', '3');

describe('jsonrpc errors', () => {
  test(JSONRPC_ERRORS.InvalidRequest.name, async () => {
    const response = await baseRequest([]);
    expect(response).toHaveProperty('error.code', -32600);
    expect(response).toHaveProperty('error.message', 'Invalid request');

    const response2 = await baseRequest([1, 2]);
    expect(response2).toHaveLength(2);
    expect(response2[0]).toHaveProperty('error.code', -32600);
    expect(response2[0]).toHaveProperty('error.message', 'Invalid request');
    expect(response2[1]).toHaveProperty('error.code', -32600);
    expect(response2[1]).toHaveProperty('error.message', 'Invalid request');
  });

  test(JSONRPC_ERRORS.MethodNotFound.name, async () => {
    const response = await jsonrpcRequest('invalid.method', { genesis });
    expect(response).toHaveProperty('error.code', -32601);
    expect(response).toHaveProperty('error.message', 'Method not found');
  });

  test(JSONRPC_ERRORS.InvalidParams.name, async () => {
    const response = await jsonrpcRequest('program.data', { genesis });
    expect(response).toHaveProperty('error.code', -32602);
    expect(response).toHaveProperty('error.message', 'Invalid params');
  });

  test(JSONRPC_ERRORS.NoGenesisFound.name, async () => {
    const response = await jsonrpcRequest('program.all', {});
    console.log(response);
    expect(response).toHaveProperty('error.code', -32605);
    expect(response).toHaveProperty('error.message', 'Genesis not found in the request');
  });

  test(JSONRPC_ERRORS.UnknownNetwork.name, async () => {
    const response = await jsonrpcRequest('program.all', { genesis: '0x1234' });
    expect(response).toHaveProperty('error.code', -32605);
    expect(response).toHaveProperty('error.message', 'Unknown network');
  });

  test(JSONRPC_ERRORS.ProgramNotFound.name, async () => {
    const response = await jsonrpcRequest('program.data', { genesis, id: '0x1234' });
    expect(response).toHaveProperty('error.code', -32404);
    expect(response).toHaveProperty('error.message', 'Program not found');
  });

  test(JSONRPC_ERRORS.CodeNotFound.name, async () => {
    const response = await jsonrpcRequest('code.data', { genesis, id: '0x1234' });
    expect(response).toHaveProperty('error.code', -32404);
    expect(response).toHaveProperty('error.message', 'Code not found');
  });

  test(JSONRPC_ERRORS.MessageNotFound.name, async () => {
    const response = await jsonrpcRequest('message.data', { genesis, id: '0x1234' });
    expect(response).toHaveProperty('error.code', -32404);
    expect(response).toHaveProperty('error.message', 'Message not found');
  });

  test(JSONRPC_ERRORS.InvalidMetaHex.name, async () => {
    const response = await jsonrpcRequest('meta.add', { hash, hex: '0x' });
    expect(response).toHaveProperty('error.code', -32602);
    expect(response).toHaveProperty('error.message', 'Invalid meta hex');
  });

  test(JSONRPC_ERRORS.MetadataNotFound.name, async () => {
    const response = await jsonrpcRequest('meta.get', { hash: '0x' });
    expect(response).toHaveProperty('error.code', -32404);
    expect(response).toHaveProperty('error.message', 'Metadata not found');
  });
});
