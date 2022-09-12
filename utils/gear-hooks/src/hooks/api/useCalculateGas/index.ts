import { GasInfo, Hex, Metadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { useContext } from 'react';
import { AccountContext, ApiContext } from 'context';
import { InitUploadOptions, InitCreateOptions, HandleOptions, ReplyOptions } from './types';

function useUploadCalculateGas(
  code: Hex | Buffer | undefined,
  metaOrPayloadType?: Metadata | string | undefined,
  options?: InitUploadOptions,
) {
  const { api } = useContext(ApiContext); // сircular dependency fix
  const { account } = useContext(AccountContext);

  const calculateGas = (initPayload: AnyJson): Promise<GasInfo> => {
    if (!account) return Promise.reject(new Error('No account address'));
    if (!code) return Promise.reject(new Error('No program source'));

    const { decodedAddress } = account;
    const { value = 0, isOtherPanicsAllowed = false } = options || {};

    return api.program.calculateGas.initUpload(
      decodedAddress,
      code,
      initPayload,
      value,
      isOtherPanicsAllowed,
      metaOrPayloadType,
    );
  };

  return calculateGas;
}

function useCreateCalculateGas(
  codeId: Hex | undefined,
  metaOrPayloadType?: Metadata | string | undefined,
  options?: InitCreateOptions,
) {
  const { api } = useContext(ApiContext); // сircular dependency fix
  const { account } = useContext(AccountContext);

  const calculateGas = (initPayload: AnyJson): Promise<GasInfo> => {
    if (!account) return Promise.reject(new Error('No account address'));
    if (!codeId) return Promise.reject(new Error('No program source'));

    const { decodedAddress } = account;
    const { value = 0, isOtherPanicsAllowed = false } = options || {};

    return api.program.calculateGas.initCreate(
      decodedAddress,
      codeId,
      initPayload,
      value,
      isOtherPanicsAllowed,
      metaOrPayloadType,
    );
  };

  return calculateGas;
}

function useHandleCalculateGas(
  destinationId: Hex | Buffer | undefined,
  metaOrPayloadType?: Metadata | string | undefined,
  options?: HandleOptions,
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
      metaOrPayloadType,
    );
  };

  return calculateGas;
}

function useReplyCalculateGas(
  messageId: Hex | undefined,
  exitCode: number | undefined,
  metaOrPayloadType?: Metadata | string | undefined,
  options?: ReplyOptions,
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
      metaOrPayloadType,
    );
  };

  return calculateGas;
}

export { useUploadCalculateGas, useCreateCalculateGas, useHandleCalculateGas, useReplyCalculateGas };
