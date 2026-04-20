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

export const validateBlobHash = validateCodeId;

export const validateSignature = validateCode;
