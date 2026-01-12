import { HexString } from '@vara-eth/api';

import { EXPLORER_URL } from '@/shared/config';
import { fetchWithGuard } from '@/shared/utils';

export type Code = {
  id: HexString;
  status: string;
  createdAt: string;
};

export const getCode = (id: HexString) => fetchWithGuard<Code>({ url: `${EXPLORER_URL}/codes/${id}` });
