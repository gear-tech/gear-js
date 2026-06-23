import { isAddress, isHash, isHex } from 'viem';

const isString = (data: unknown): data is string => {
  return typeof data === 'string';
};

export const validateSender = (data: unknown) => {
  if (!isString(data)) return false;
  return isAddress(data);
};

export const validateCode = (data: unknown) => {
  if (!isString(data)) return false;
  return isHex(data);
};

export const validateCodeId = (data: unknown) => {
  if (!isString(data)) return false;
  return isHash(data);
};

export const validateBlobHashes = (data: unknown) => {
  if (!Array.isArray(data) || data.length === 0) return false;
  return data.every((item) => isString(item) && isHash(item));
};

export const validateDeadline = (data: unknown) => {
  const n = Number(data);
  if (!Number.isInteger(n) || n <= 0) return false;
  return n > Math.floor(Date.now() / 1000);
};

export const validateSignature = (data: unknown) => {
  if (typeof data !== 'string') return false;
  return isHex(data) && data.length === 132;
};
