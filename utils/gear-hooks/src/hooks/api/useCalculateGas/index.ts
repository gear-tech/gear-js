import { GasInfo, Hex, Metadata } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { useContext } from 'react';
import { AccountContext, ApiContext } from 'context';
import { CalculateGas, InitUploadOptions, InitCreateOptions, HandleOptions, ReplyOptions } from './types';

function useCalculateGas(
  code: Hex | Buffer | undefined,
  metaOrPayloadType?: Metadata | string | undefined,
  options?: InitUploadOptions,
): CalculateGas;
function useCalculateGas(
  codeId: Hex | undefined,
  metaOrPayloadType?: Metadata | string | undefined,
  options?: InitCreateOptions,
): CalculateGas;
function useCalculateGas(
  destinationId: Hex | Buffer | undefined,
  metaOrPayloadType?: Metadata | string | undefined,
  options?: HandleOptions,
): CalculateGas;
function useCalculateGas(
  messageId: Hex | undefined,
  metaOrPayloadType?: Metadata | string | undefined,
  options?: ReplyOptions,
): CalculateGas;
function useCalculateGas(
  codeOrCodeIdOrDestinationIdOrMessageId: Hex | Buffer | undefined,
  metaOrPayloadType?: Metadata | string | undefined,
  options?: InitUploadOptions | InitCreateOptions | HandleOptions | ReplyOptions,
): CalculateGas {
  const { api } = useContext(ApiContext); // сircular dependency fix
  const { account } = useContext(AccountContext);

  const calculateGas = (initPayload: AnyJson): Promise<GasInfo> => {
    if (!account) return Promise.reject(new Error('No account address'));
    if (!codeOrCodeIdOrDestinationIdOrMessageId) return Promise.reject(new Error('No program source'));

    const { decodedAddress } = account;
    const { method = 'handle', value = 0, isOtherPanicsAllowed = false } = options || {};

    // @ts-ignore
    return api.program.calculateGas[method](
      decodedAddress,
      codeOrCodeIdOrDestinationIdOrMessageId,
      initPayload,
      value,
      isOtherPanicsAllowed,
      metaOrPayloadType,
    );
  };

  return calculateGas;
}

export { useCalculateGas };
