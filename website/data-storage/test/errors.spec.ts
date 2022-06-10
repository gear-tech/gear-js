import { JSONRPC_ERRORS } from '@gear-js/common';

import { MessageNotFound, MetadataNotFound, ProgramNotFound, SignatureNotVerified } from '../src/errors';

describe('Errors', () => {
  it('MessageNotFound', () => {
    expect(MessageNotFound.name).toBe(JSONRPC_ERRORS.MessageNotFound.name);
  });
  it('MetadataNotFound', () => {
    expect(MetadataNotFound.name).toBe(JSONRPC_ERRORS.MetadataNotFound.name);
  });
  it('ProgramNotFound', () => {
    expect(ProgramNotFound.name).toBe(JSONRPC_ERRORS.ProgramNotFound.name);
  });
  it('SignNotVerified', () => {
    expect(SignatureNotVerified.name).toBe(JSONRPC_ERRORS.SignatureNotVerified.name);
  });
});
