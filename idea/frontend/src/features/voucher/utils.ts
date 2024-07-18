import { DEFAULT_LIMIT } from '@/shared/config';
import { fetchWithGuard } from '@/shared/helpers';

import { VouchersResponse } from './types';

const MULTIPLIER = { MS: 1000, S: 60, M: 60, H: 24, D: 30 };

function getMilliseconds(value: number, unit: 'hour' | 'day' | 'month') {
  const UNIT_MULTIPLIER = {
    hour: MULTIPLIER.MS * MULTIPLIER.S * MULTIPLIER.M,
    day: MULTIPLIER.MS * MULTIPLIER.S * MULTIPLIER.M * MULTIPLIER.H,
    month: MULTIPLIER.MS * MULTIPLIER.S * MULTIPLIER.M * MULTIPLIER.H * 30,
  };

  return value * UNIT_MULTIPLIER[unit];
}

const getPluralizedUnit = (value: number, unit: string) => `${value} ${unit}${value > 1 ? 's' : ''}`;

function getTime(ms: number) {
  const minutes = Math.floor((ms / (MULTIPLIER.MS * MULTIPLIER.S)) % MULTIPLIER.M);
  const hours = Math.floor((ms / (MULTIPLIER.MS * MULTIPLIER.S * MULTIPLIER.M)) % MULTIPLIER.H);
  const days = Math.floor(ms / (MULTIPLIER.MS * MULTIPLIER.S * MULTIPLIER.M * MULTIPLIER.H)) % MULTIPLIER.D;
  const months = Math.floor(ms / (MULTIPLIER.MS * MULTIPLIER.S * MULTIPLIER.M * MULTIPLIER.H * MULTIPLIER.D));

  let result = '';

  if (months) result += getPluralizedUnit(months, 'month') + ' ';
  if (days) result += getPluralizedUnit(days, 'day') + ' ';
  if (hours) result += getPluralizedUnit(hours, 'hour') + ' ';
  if (minutes) result += getPluralizedUnit(minutes, 'minute');

  return result.trim();
}

const getVouchers = (url: string, params: { programs?: string[]; offset: number; limit: number; id: string }) => {
  const method = 'POST';
  const body = JSON.stringify(params);
  const headers = { 'Content-Type': 'application/json' };

  return fetchWithGuard<VouchersResponse>(`${url}/vouchers`, { method, body, headers });
};

const getNextPageParam = (lastPage: VouchersResponse, allPages: VouchersResponse[]) => {
  const totalCount = lastPage.count;
  const lastPageCount = lastPage.vouchers.length;
  const fetchedCount = (allPages.length - 1) * DEFAULT_LIMIT + lastPageCount;

  return fetchedCount < totalCount ? fetchedCount : undefined;
};

export { getPluralizedUnit, getMilliseconds, getTime, getVouchers, getNextPageParam };
