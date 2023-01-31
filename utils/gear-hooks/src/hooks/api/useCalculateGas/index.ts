import { GasInfo, ProgramMetadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { useContext } from 'react';
import { AccountContext, ApiContext } from 'context';
import { Options } from './types';

function useUploadCalculateGas(
  code: HexString | Buffer | undefined,
  meta?: ProgramMetadata | undefined,
  options?: Options,
) {
  const { api } = useContext(ApiContext); // сircular dependency fix
  const { account } = useContext(AccountContext);

  const calculateGas = (initPayload: AnyJson): Promise<GasInfo> => {
    if (!account) return Promise.reject(new Error('No account address'));
    if (!code) return Promise.reject(new Error('No program source'));

    const { decodedAddress } = account;
    const { value = 0, isOtherPanicsAllowed = false } = options || {};

    return api.program.calculateGas.initUpload(decodedAddress, code, initPayload, value, isOtherPanicsAllowed, meta);
  };

  return calculateGas;
}

function useCreateCalculateGas(codeId: HexString | undefined, meta?: ProgramMetadata | undefined, options?: Options) {
  const { api } = useContext(ApiContext); // сircular dependency fix
  const { account } = useContext(AccountContext);

  const calculateGas = (initPayload: AnyJson): Promise<GasInfo> => {
    if (!account) return Promise.reject(new Error('No account address'));
    if (!codeId) return Promise.reject(new Error('No program source'));

    const { decodedAddress } = account;
    const { value = 0, isOtherPanicsAllowed = false } = options || {};

    return api.program.calculateGas.initCreate(decodedAddress, codeId, initPayload, value, isOtherPanicsAllowed, meta);
  };

  return calculateGas;
}

function useHandleCalculateGas(
  destinationId: HexString | Buffer | undefined,
  meta?: ProgramMetadata | undefined,
  options?: Options,
) {
  const { api } = useContext(ApiContext); // сircular dependency fix
  const { account } = useContext(AccountContext);

  const calculateGas = (initPayload: AnyJson): Promise<GasInfo> => {
    if (!account) return Promise.reject(new Error('No account address'));
    if (!destinationId) return Promise.reject(new Error('No program source'));

    const { decodedAddress } = account;
    const { value = 0, isOtherPanicsAllowed = false } = options || {};

    return api.program.calculateGas.handle(
      decodedAddress,
      destinationId,
      initPayload,
      value,
      isOtherPanicsAllowed,
      meta,
    );
  };

  return calculateGas;
}

function useReplyCalculateGas(
  messageId: HexString | undefined,
  exitCode: number | undefined,
  meta?: ProgramMetadata | undefined,
  options?: Options,
) {
  const { api } = useContext(ApiContext); // сircular dependency fix
  const { account } = useContext(AccountContext);

  const calculateGas = (initPayload: AnyJson) => {
    if (!account) return Promise.reject(new Error('No account address'));
    if (!messageId) return Promise.reject(new Error('No program source'));
    if (!exitCode) return Promise.reject(new Error('No exit code'));

    const { decodedAddress } = account;
    const { value = 0, isOtherPanicsAllowed = false } = options || {};

    return api.program.calculateGas.reply(
      decodedAddress,
      messageId,
      exitCode,
      initPayload,
      value,
      isOtherPanicsAllowed,
      meta,
    );
  };

  return calculateGas;
}

export { useUploadCalculateGas, useCreateCalculateGas, useHandleCalculateGas, useReplyCalculateGas };
