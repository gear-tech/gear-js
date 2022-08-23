import { Event } from '@polkadot/types/interfaces';
import isString from 'lodash.isstring';
import { GearApi } from '@gear-js/api';
import { Account } from '@gear-js/react-hooks';

import { DEVELOPMENT_CHAIN, ACCOUNT_ERRORS, FileTypes, LocalStorage } from 'shared/config';

const checkWallet = (account?: Account) => {
  if (!account) {
    throw new Error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);
  }

  if (parseInt(account.balance.value, 10) === 0) {
    throw new Error(ACCOUNT_ERRORS.WALLET_BALLANCE_IS_ZERO);
  }
};

const formatDate = (rawDate: string) => {
  const date = new Date(rawDate);
  const time = date.toLocaleTimeString('en-GB');
  const formatedDate = date.toLocaleDateString('en-US').replaceAll('/', '-');

  return `${formatedDate} ${time}`;
};

const readFileAsync = <T extends File, K extends boolean>(
  file: T,
  readAsBuffer = true,
): Promise<(K extends true ? ArrayBuffer : string) | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as (K extends true ? ArrayBuffer : string) | null);
    };

    reader.onerror = reject;

    if (readAsBuffer) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });

const copyToClipboard = (key: string, alert: any, successfulText?: string) => {
  try {
    navigator.clipboard.writeText(key);
    alert.success(successfulText || 'Copied');
  } catch (err) {
    alert.error('Copy error');
  }
};

const checkFileFormat = (file: File, types: string | string[] = FileTypes.Wasm) => {
  if (Array.isArray(types)) {
    return types.some((type) => type === file.type);
  }

  return types === file.type;
};
const generateRandomId = () => Math.floor(Math.random() * 100000000);

const getShortName = (filename: string, maxLength = 24) => {
  const transformedFileName = filename;

  const halfLenght = Math.floor(maxLength / 2);

  return transformedFileName.length > maxLength
    ? `${transformedFileName.slice(0, halfLenght)}…${transformedFileName.slice(-halfLenght)}`
    : transformedFileName;
};

const getPreformattedText = (data: unknown) => JSON.stringify(data, null, 4);

const getExtrinsicFailedMessage = (api: GearApi, event: Event) => {
  const { docs, method: errorMethod } = api.getExtrinsicFailedError(event);
  const formattedDocs = docs.filter(Boolean).join('. ');

  return `${errorMethod}: ${formattedDocs}`;
};

const isHex = (value: string) => {
  const hexRegex = /^0x[\da-fA-F]+/;

  return isString(value) && hexRegex.test(value);
};

const isDevChain = () => localStorage.getItem(LocalStorage.Chain) === DEVELOPMENT_CHAIN;

const isNodeAddressValid = (address: string) => {
  const nodeRegex = /(ws|wss):\/\/[\w-.]+/;

  return isString(address) && nodeRegex.test(address);
};

export {
  checkWallet,
  formatDate,
  readFileAsync,
  copyToClipboard,
  checkFileFormat,
  getShortName,
  generateRandomId,
  getPreformattedText,
  getExtrinsicFailedMessage,
  isHex,
  isDevChain,
  isNodeAddressValid,
};
