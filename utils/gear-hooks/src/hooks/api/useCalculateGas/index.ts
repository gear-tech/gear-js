import { GasInfo, Hex, Metadata } from '@gear-js/api';
import { useContext } from 'react';
import { AnyJson } from '@polkadot/types/types';
import { AccountContext, ApiContext } from 'context';
import { CalculateGas, HandleOptions, InitOptions } from './types';

function useCalculateGas(
  programBuffer: Buffer | undefined,
  metadata?: Metadata | undefined,
  options?: InitOptions,
): CalculateGas;
function useCalculateGas(
  programIdOrBuffer: Hex | Buffer | undefined,
  metadata?: Metadata | undefined,
  options?: HandleOptions,
): CalculateGas;
function useCalculateGas(
  programIdOrBuffer: Hex | Buffer | undefined,
  metadata?: Metadata | undefined,
  options?: InitOptions | HandleOptions,
): CalculateGas {
  const { api } = useContext(ApiContext); // сircular dependency fix
  const { account } = useContext(AccountContext);

  const calculateGas = (initPayload: AnyJson): Promise<GasInfo> => {
    if (!account) return Promise.reject(new Error('No account address'));
    if (!programIdOrBuffer) return Promise.reject(new Error('No program source'));

    const { decodedAddress } = account;
    const { method = 'handle', value = 0, isOtherPanicsAllowed = false } = options || {};

    // @ts-ignore
    return api.program.calculateGas[method](
      decodedAddress,
      programIdOrBuffer,
      initPayload,
      value,
      isOtherPanicsAllowed,
      metadata,
    );
  };

  return calculateGas;
}

export { useCalculateGas };
