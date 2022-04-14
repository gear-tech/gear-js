import errors from '@gear-js/jsonrpc-errors';
import { MessageNotFound, MetadataNotFound, ProgramNotFound, SignatureNotVerified } from '../src/errors';

describe('Errors', () => {
  it('MessageNotFound', () => {
    expect(MessageNotFound.name).toBe(errors.MessageNotFound.name);
  });
  it('MetadataNotFound', () => {
    expect(MetadataNotFound.name).toBe(errors.MetadataNotFound.name);
  });
  it('ProgramNotFound', () => {
    expect(ProgramNotFound.name).toBe(errors.ProgramNotFound.name);
  });
  it('SignNotVerified', () => {
    expect(SignatureNotVerified.name).toBe(errors.SignatureNotVerified.name);
  });
});
