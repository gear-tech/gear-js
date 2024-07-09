import type { Event } from '@polkadot/types/interfaces';
import { GearApi, HexString } from '@gear-js/api';
import { Account, AlertContainerFactory } from '@gear-js/react-hooks';

import { ACCOUNT_ERRORS, NODE_ADRESS_URL_PARAM, FileTypes } from '@/shared/config';

import { isAndroid, isIOS } from '@react-aria/utils';
import { isHexValid, isExists, isAccountAddressValid, isNumeric, asOptionalField } from './form';

const checkWallet = (account?: Account) => {
  if (!account) {
    throw new Error(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED);
  }
};

const formatDate = (rawDate: string | number) => {
  const date = new Date(rawDate);
  const time = date.toLocaleTimeString('en-GB');
  const formatedDate = date.toLocaleDateString('en-US').replace(/\//g, '-');

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
  const { docs, method } = api.getExtrinsicFailedError(event);

  return `${method}: ${docs}`;
};

const isNodeAddressValid = (address: string) => {
  const nodeRegex = /(ws|wss):\/\/[\w-.]+/;

  return isString(address) && nodeRegex.test(address);
};

const getNodeAddressFromUrl = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const nodeAddress = searchParams.get(NODE_ADRESS_URL_PARAM);

  if (nodeAddress && isNodeAddressValid(nodeAddress)) {
    return nodeAddress;
  }
};

const disableScroll = () => document.body.classList.add('noOverflow');
const enableScroll = () => document.body.classList.remove('noOverflow');

const resetFileInput = (target: HTMLInputElement | null) => {
  if (!target) return;

  // eslint-disable-next-line no-param-reassign
  target.value = '';
  const changeEvent = new Event('change', { bubbles: true });
  target.dispatchEvent(changeEvent);
};

const isMobileDevice = () => isIOS() || (isAndroid() as boolean); // asserting cuz isAndroid somehow any

const isUndefined = (value: unknown): value is undefined => value === undefined;

const isNullOrUndefined = (value: unknown): value is null | undefined => value === null || isUndefined(value);

const isString = (value: unknown): value is string => typeof value === 'string';

const isHex = (value: unknown): value is HexString => {
  const HEX_REGEX = /^0x[\da-fA-F]+$/;

  return isString(value) && (value === '0x' || (HEX_REGEX.test(value) && value.length % 2 === 0));
};

const fetchWithGuard = async <T extends object>(...args: Parameters<typeof fetch>) => {
  const response = await fetch(...args);

  if (!response.ok) throw new Error(response.statusText);

  return response.json() as T;
};

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

export {
  checkWallet,
  formatDate,
  readFileAsync,
  copyToClipboard,
  checkFileFormat,
  getShortName,
  generateRandomId,
  getPreformattedText,
  getNodeAddressFromUrl,
  getExtrinsicFailedMessage,
  isNodeAddressValid,
  isHexValid,
  isExists,
  disableScroll,
  enableScroll,
  resetFileInput,
  isMobileDevice,
  isNullOrUndefined,
  isAccountAddressValid,
  isNumeric,
  asOptionalField,
  isString,
  isUndefined,
  isHex,
  fetchWithGuard,
  getErrorMessage,
};
