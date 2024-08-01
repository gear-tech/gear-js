import { HexString } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { isHex } from '@polkadot/util';
import { z } from 'zod';

function useProgramIdSchema(list: HexString[]) {
  const { api, isApiReady } = useApi();

  const isProgramExists = (id: HexString) => {
    if (!isApiReady) throw new Error('API is not initialized');

    return api.program.exists(id).catch((e) => console.error(e));
  };

  return z
    .custom<HexString>()
    .refine((value) => isHex(value), 'Value should be hex')
    .refine((value) => value.length === 66, 'Invalid program ID')
    .refine((value) => !list.includes(value), 'Program ID already exists')
    .refine((value) => isProgramExists(value), 'Program not found in the storage');
}

export { useProgramIdSchema };
