import type { Hex } from 'viem';

import { METADATA_STORAGE_API_URL } from '@/shared/config';
import { fetchWithGuard } from '@/shared/utils';

type GetIdlResponse = {
  codeId: Hex;
  data: string;
};

const getIdl = (codeId: Hex) => {
  const url = new URL(`${METADATA_STORAGE_API_URL}/sails`);
  url.searchParams.set('codeId', codeId);

  return fetchWithGuard<GetIdlResponse>({ url });
};

const addIdl = (codeId: Hex, data: string) =>
  fetchWithGuard({
    url: `${METADATA_STORAGE_API_URL}/sails`,
    method: 'POST',
    parameters: { codeId, data },
  });

export { addIdl, getIdl };
