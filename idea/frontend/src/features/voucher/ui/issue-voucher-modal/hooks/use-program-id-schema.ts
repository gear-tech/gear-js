import { HexString } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { isHex } from '@polkadot/util';
import { z } from 'zod';

function useProgramIdSchema() {
  const { api, isApiReady } = useApi();

  const getProgramIdSchema = () => {
    if (!isApiReady) throw new Error('API is not initialized');

    return z
      .custom<HexString>()
      .refine((value) => isHex(value), 'Value should be hex')
      .refine(async (value) => {
        try {
          await api.programStorage.getProgram(value);
          return true;
        } catch {
          return false;
        }
      }, 'Program not found in the storage');
  };

  return getProgramIdSchema();
}

export { useProgramIdSchema };
