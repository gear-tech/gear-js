import isPlainObject from 'lodash.isplainobject';
import { Metadata, Hex, GasInfo } from '@gear-js/api';
import { useApi, useAlert, useAccount } from '@gear-js/react-hooks';

import { GasMethod } from 'shared/config';

import { Values, Code, Result } from './types';
import { preparedGasInfo } from './helpers';

const useGasCalculate = () => {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();

  const calculateGas = async <T extends GasMethod>(
    method: T,
    values: Values,
    code: Code<T>,
    meta?: Metadata,
    addressId?: string,
  ): Promise<Result> => {
    const { value, payload, payloadType } = values;

    try {
      const isPayloadEmpty = isPlainObject(payload) && Object.keys(payload as object).length === 0;

      if (isPayloadEmpty) throw new Error(`Paylod can't be empty`);
      if (!account) throw new Error(`No account`);

      const { decodedAddress } = account;
      const metaOrTypeOfPayload = meta || payloadType;

      let estimatedGas: GasInfo;

      switch (method) {
        case GasMethod.InitUpdate:
          estimatedGas = await api.program.calculateGas.initUpload(
            decodedAddress,
            code as Buffer,
            payload,
            value,
            true,
            metaOrTypeOfPayload,
          );
          break;
        case GasMethod.InitCreate:
          estimatedGas = await api.program.calculateGas.initCreate(
            decodedAddress,
            code as Hex,
            payload,
            value,
            true,
            metaOrTypeOfPayload,
          );
          break;
        case GasMethod.Handle:
          estimatedGas = await api.program.calculateGas.handle(
            decodedAddress,
            addressId as Hex,
            payload,
            value,
            true,
            metaOrTypeOfPayload,
          );
          break;
        case GasMethod.Reply:
          estimatedGas = await api.program.calculateGas.reply(
            decodedAddress,
            addressId as Hex,
            0,
            payload,
            value,
            true,
            metaOrTypeOfPayload,
          );
          break;
        default:
          throw new Error('Unknown method');
      }

      return preparedGasInfo(estimatedGas);
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);

      return Promise.reject(error);
    }
  };

  return calculateGas;
};

export { useGasCalculate };
