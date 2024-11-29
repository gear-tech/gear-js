import { HexString } from '@polkadot/util/types';
import ky from 'ky';

import { META_STORAGE_API_URL } from '@/shared/config';

type GetMetaResult = {
  hash: string;
  hex: HexString;
  hasState: boolean;
};

const fetchMetadata = (hash: HexString) =>
  ky
    .get(`${META_STORAGE_API_URL}/meta`, {
      searchParams: { hash },
    })
    .json<GetMetaResult>()
    .then(({ hex }) => ({ result: { hex } }));

const addMetadata = (hash: HexString, hex: HexString) =>
  ky.post(`${META_STORAGE_API_URL}/meta`, {
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ hash, hex }),
  });

export { addMetadata, fetchMetadata };
