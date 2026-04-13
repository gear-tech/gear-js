import type { Hex } from 'viem';

import { fetchWithGuard } from '@/shared/utils';

export type Code = {
  id: Hex;
  status: string;
  createdAt: string;
};

export const getCode = (explorerUrl: string, id: Hex) => fetchWithGuard<Code>({ url: `${explorerUrl}/codes/${id}` });
