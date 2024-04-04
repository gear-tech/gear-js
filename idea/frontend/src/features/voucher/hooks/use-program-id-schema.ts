import { HexString } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { isHex } from '@polkadot/util';
import { z } from 'zod';

function useProgramIdSchema(list: HexString[]) {
  const { api, isApiReady } = useApi();

  const isProgramExists = async (id: HexString) => {
    if (!isApiReady) throw new Error('API is not initialized');

    try {
      await api.programStorage.getProgram(id);
      return true;
    } catch {
      return false;
    }
  };

  return z
    .custom<HexString>()
    .refine((value) => isHex(value), 'Value should be hex')
    .refine((value) => !list.includes(value), 'Program ID already exists')
    .refine(async (value) => isProgramExists(value), 'Program not found in the storage');
}

export { useProgramIdSchema };
