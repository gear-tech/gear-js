import { ProgramMetadata, GasInfo } from '@gear-js/api';
import { useApi, useAccount } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import isPlainObject from 'lodash.isplainobject';

import { GasMethod } from '@/shared/config';

import { preparedGasInfo } from './helpers';
import { Values, Code, Result } from './types';

const useGasCalculate = () => {
  const { api, isApiReady } = useApi();
  const { account } = useAccount();

  const calculateGas = async <T extends GasMethod>(
    method: T,
    values: Values,
    code: Code<T>,
    meta?: ProgramMetadata,
    addressId?: string,
  ): Promise<Result> => {
    const { value, payload } = values;

    try {
      if (!isApiReady) throw new Error('API is not initialized');

      const isPayloadEmpty = isPlainObject(payload) && Object.keys(payload as object).length === 0;

      if (isPayloadEmpty) throw new Error(`Payload can't be empty`);
      if (!account) throw new Error(`No account`);

      const { decodedAddress } = account;

      let estimatedGas: GasInfo;

      switch (method) {
        case GasMethod.InitUpdate:
          estimatedGas = await api.program.calculateGas.initUpload(
            decodedAddress,
            code as Buffer,
            payload,
            value,
            true,
            meta,
          );
          break;
        case GasMethod.InitCreate:
          estimatedGas = await api.program.calculateGas.initCreate(
            decodedAddress,
            code as HexString,
            payload,
            value,
            true,
            meta,
          );
          break;
        case GasMethod.Handle:
          estimatedGas = await api.program.calculateGas.handle(
            decodedAddress,
            addressId as HexString,
            payload,
            value,
            true,
            meta,
          );
          break;
        case GasMethod.Reply:
          estimatedGas = await api.program.calculateGas.reply(
            decodedAddress,
            addressId as HexString,
            payload,
            value,
            true,
            meta,
          );
          break;
        default:
          throw new Error('Unknown method');
      }

      return preparedGasInfo(estimatedGas);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return calculateGas;
};

export { useGasCalculate };
