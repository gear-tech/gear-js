import { GasInfo, ProgramMetadata } from '@gear-js/api';
import { AnyJson, AnyNumber } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';

import { useApi, useAccount } from '@/context';

import { Options } from './types';

function useUploadCalculateGas(code: HexString | Buffer | undefined, meta?: ProgramMetadata, options?: Options) {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();

  const calculateGas = (initPayload: AnyJson, value: AnyNumber = 0): Promise<GasInfo> => {
    if (!isApiReady) return Promise.reject(new Error('API is not initialized'));
    if (!account) return Promise.reject(new Error('No account address'));
    if (!code) return Promise.reject(new Error('No program source'));

    const { decodedAddress } = account;
    const { isOtherPanicsAllowed = false } = options || {};

    return api.program.calculateGas.initUpload(decodedAddress, code, initPayload, value, isOtherPanicsAllowed, meta);
  };

  return calculateGas;
}

function useCreateCalculateGas(codeId: HexString | undefined, meta?: ProgramMetadata, options?: Options) {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();

  const calculateGas = (initPayload: AnyJson, value: AnyNumber = 0): Promise<GasInfo> => {
    if (!isApiReady) return Promise.reject(new Error('API is not initialized'));
    if (!account) return Promise.reject(new Error('No account address'));
    if (!codeId) return Promise.reject(new Error('No program source'));

    const { decodedAddress } = account;
    const { isOtherPanicsAllowed = false } = options || {};

    return api.program.calculateGas.initCreate(decodedAddress, codeId, initPayload, value, isOtherPanicsAllowed, meta);
  };

  return calculateGas;
}

function useHandleCalculateGas(destinationId: HexString | undefined, meta?: ProgramMetadata, options?: Options) {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();

  const calculateGas = (initPayload: AnyJson, value: AnyNumber = 0): Promise<GasInfo> => {
    if (!isApiReady) return Promise.reject(new Error('API is not initialized'));
    if (!account) return Promise.reject(new Error('No account address'));
    if (!destinationId) return Promise.reject(new Error('No program source'));

    const { decodedAddress } = account;
    const { isOtherPanicsAllowed = false } = options || {};

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

function useReplyCalculateGas(messageId: HexString | undefined, meta?: ProgramMetadata, options?: Options) {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();

  const calculateGas = (initPayload: AnyJson, value: AnyNumber = 0) => {
    if (!isApiReady) return Promise.reject(new Error('API is not initialized'));
    if (!account) return Promise.reject(new Error('No account address'));
    if (!messageId) return Promise.reject(new Error('No program source'));

    const { decodedAddress } = account;
    const { isOtherPanicsAllowed = false } = options || {};

    return api.program.calculateGas.reply(decodedAddress, messageId, initPayload, value, isOtherPanicsAllowed, meta);
  };

  return calculateGas;
}

export { useUploadCalculateGas, useCreateCalculateGas, useHandleCalculateGas, useReplyCalculateGas };
