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
  return Number.isInteger(n) && n > 0;
};

export const validateV = (data: unknown) => {
  const n = Number(data);
  return Number.isInteger(n) && n >= 0 && n <= 255;
};

export const validateR = validateCodeId;
export const validateS = validateCodeId;
