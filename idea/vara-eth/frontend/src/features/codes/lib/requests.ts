import { Hex } from 'viem';

import { EXPLORER_URL } from '@/shared/config';
import { fetchWithGuard } from '@/shared/utils';

export type Code = {
  id: Hex;
  status: string;
  createdAt: string;
};

export const getCode = (id: Hex) => fetchWithGuard<Code>({ url: `${EXPLORER_URL}/codes/${id}` });
