import { useCallback } from 'react';
import isPlainObject from 'lodash.isplainobject';
import { Metadata, Hex, GasInfo } from '@gear-js/api';
import { useApi, useAlert } from '@gear-js/react-hooks';

import { LocalStorage, GasMethod } from 'shared/config';
import { getSubmitPayload } from 'components/common/Form/FormPayload/helpers';

import { Values, Code } from './types';

const useGasCalculate = () => {
  const alert = useAlert();
  const { api } = useApi();

  const calculateGas = useCallback(
    async <T extends GasMethod>(
      method: T,
      values: Values,
      code: Code<T>,
      meta?: Metadata,
      addressId?: string,
    ): Promise<number> => {
      const { value, payload, payloadType } = values;

      const submitPayload = getSubmitPayload(payload);

      if (isPlainObject(submitPayload) && Object.keys(submitPayload as object).length === 0) {
        throw new Error(`Paylod can't be empty`);
      }

      const publicKeyRaw = localStorage.getItem(LocalStorage.PublicKeyRaw) as Hex;
      const metaOrTypeOfPayload = meta || payloadType;

      let estimatedGas: GasInfo;

      switch (method) {
        case GasMethod.InitUpdate:
          estimatedGas = await api.program.calculateGas.initUpload(
            publicKeyRaw,
            code as Buffer,
            submitPayload,
            value,
            true,
            metaOrTypeOfPayload,
          );
          break;
        case GasMethod.InitCreate:
          estimatedGas = await api.program.calculateGas.initCreate(
            publicKeyRaw,
            code as Hex,
            submitPayload,
            value,
            true,
            metaOrTypeOfPayload,
          );
          break;
        case GasMethod.Handle:
          estimatedGas = await api.program.calculateGas.handle(
            publicKeyRaw,
            addressId as Hex,
            submitPayload,
            value,
            true,
            metaOrTypeOfPayload,
          );
          break;
        case GasMethod.Reply:
          estimatedGas = await api.program.calculateGas.reply(
            publicKeyRaw,
            addressId as Hex,
            0,
            submitPayload,
            value,
            true,
            metaOrTypeOfPayload,
          );
          break;
        default:
          throw new Error('Unknown method');
      }

      const minLimit = estimatedGas.min_limit.toNumber();

      alert.info(`Estimated gas ${minLimit}`);

      return minLimit;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api],
  );

  return calculateGas;
};

export { useGasCalculate };
