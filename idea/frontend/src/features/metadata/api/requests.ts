import { HexString } from '@polkadot/util/types';

import { METADATA_STORAGE_API_URL } from '@/shared/config';
import { fetchWithGuard } from '@/shared/helpers';
import { GetMetaResponse } from './types';

const fetchMetadata = (hash: HexString) => {
  const url = new URL(`${METADATA_STORAGE_API_URL}/meta`);
  url.searchParams.append('hash', hash);

  return fetchWithGuard<GetMetaResponse>(url, { method: 'GET' }).then(({ hex }) => ({ result: { hex } }));
};

const addMetadata = (hash: HexString, hex: HexString) =>
  fetchWithGuard(`${METADATA_STORAGE_API_URL}/meta`, {
    method: 'POST',
    body: JSON.stringify({ hash, hex }),
  });

export { addMetadata, fetchMetadata };
