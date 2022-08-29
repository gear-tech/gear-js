import { Event } from '@polkadot/types/interfaces';
import isString from 'lodash.isstring';
import { GearApi } from '@gear-js/api';
import { Account, AlertContainerFactory } from '@gear-js/react-hooks';

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

const readFileAsync = <T extends File, K extends 'text' | 'buffer'>(
  file: T,
  readAs: K,
): Promise<K extends 'text' ? string : ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const { result } = reader;

      if (result === null) {
        throw new Error('Unable to read file');
      }

      resolve(result as K extends 'text' ? string : ArrayBuffer);
    };

    reader.onerror = reject;

    if (readAs === 'text') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });

const copyToClipboard = async (key: string, alert: AlertContainerFactory, successfulText?: string) => {
  try {
    await navigator.clipboard.writeText(key);
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
