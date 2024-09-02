import { HexString } from '@gear-js/api';
import { VoucherStatus } from './types';

async function guardedFetch<T extends object>(...args: Parameters<typeof fetch>) {
  const response = await fetch(...args);

  const result = (await response.json()) as T | { error: string; message: string };

  if (!response.ok) throw new Error('message' in result ? result.message : response.statusText);

  if ('error' in result) throw new Error(result.error);

  return result;
}

async function getVoucherId(backend: string, account: string, program: HexString): Promise<`0x${string}`> {
  const url = `${backend}gasless/voucher/request`;
  const method = 'POST';
  const headers = { 'Content-Type': 'application/json' };
  const body = JSON.stringify({ account, program });

  const { voucherId } = await guardedFetch<{ voucherId: HexString }>(url, { method, headers, body });

  return voucherId;
}

async function getVoucherStatus(backend: string, program: HexString) {
  const url = `${backend}gasless/voucher/${program}/status`;

  try {
    const status = await guardedFetch<VoucherStatus>(url);

    return status;
  } catch {
    return null;
  }
}

export { getVoucherId, getVoucherStatus };
