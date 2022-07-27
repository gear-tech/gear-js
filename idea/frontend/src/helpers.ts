import { GearApi } from '@gear-js/api';
import { Event } from '@polkadot/types/interfaces';
import isString from 'lodash.isstring';

import { NODE_ADDRESS_REGEX } from 'regexes';
import { DEVELOPMENT_CHAIN, LOCAL_STORAGE, FILE_TYPES } from 'consts';
import { localPrograms } from 'services/LocalDBService';
import { GetMetaResponse } from 'types/api';
import { ProgramModel, ProgramPaginationModel, ProgramStatus } from 'types/program';

export const getExtrinsicFailedMessage = (api: GearApi, event: Event) => {
  const { docs, method: errorMethod } = api.getExtrinsicFailedError(event);
  const formattedDocs = docs.filter(Boolean).join('. ');

  return `${errorMethod}: ${formattedDocs}`;
};

export const fileNameHandler = (filename: string, maxLength = 24) => {
  const transformedFileName = filename;

  const halfLenght = Math.floor(maxLength / 2);

  return transformedFileName.length > maxLength
    ? `${transformedFileName.slice(0, halfLenght)}…${transformedFileName.slice(-halfLenght)}`
    : transformedFileName;
};

export const formatDate = (rawDate: string) => {
  const date = new Date(rawDate);
  const time = date.toLocaleTimeString('en-GB');
  const formatedDate = date.toLocaleDateString('en-US').replaceAll('/', '-');
  return `${formatedDate} ${time}`;
};

export const generateRandomId = () => Math.floor(Math.random() * 1000000000);

export const readTextFileAsync = (file: File): Promise<string | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string | null;

      resolve(result);
    };

    reader.onerror = reject;

    reader.readAsText(file);
  });

export function readFileAsync(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
}

export const copyToClipboard = (key: string, alert: any, successfulText?: string) => {
  try {
    navigator.clipboard.writeText(key);
    alert.success(successfulText || 'Copied');
  } catch (err) {
    alert.error('Copy error');
  }
};

export const getLocalPrograms = (params: any) => {
  const result: ProgramPaginationModel = {
    count: 0,
    programs: [],
  };
  const data = { result };

  return localPrograms
    .iterate((elem: ProgramModel, key, iterationNumber) => {
      const newLimit = params.offset + params.limit;

      data.result.count = iterationNumber;

      if (params.query) {
        if (
          (elem.name?.includes(params.query) || elem.id?.includes(params.query)) &&
          iterationNumber <= newLimit &&
          iterationNumber > params.offset
        ) {
          data.result.programs.push(elem);
        }
      } else if (iterationNumber <= newLimit && iterationNumber > params.offset) {
        data.result.programs.push(elem);
      }
    })
    .then(() => {
      data.result.programs.sort((prev, next) => Date.parse(next.timestamp) - Date.parse(prev.timestamp));

      return data;
    });
};

export const getLocalProgram = (id: string) => {
  const result: ProgramModel = {
    id: '',
    owner: '',
    timestamp: '',
    initStatus: ProgramStatus.Success,
  };
  const data = { result };

  return localPrograms
    .getItem<ProgramModel>(id)
    .then((response) => {
      if (response) {
        data.result = response;
      }
    })
    .then(() => data);
};

export const getLocalProgramMeta = (id: string) => {
  const result: GetMetaResponse = {
    meta: '',
    metaFile: '',
    program: '',
  };
  const data = { result };

  return localPrograms
    .getItem<ProgramModel>(id)
    .then((response) => {
      if (response) {
        data.result.meta = response.meta.meta;
        data.result.metaFile = response.meta.metaFile;
        data.result.program = id;
      }
    })
    .then(() => data);
};

export const isDevChain = () => localStorage.getItem(LOCAL_STORAGE.CHAIN) === DEVELOPMENT_CHAIN;

export const isNodeAddressValid = (address: string) => NODE_ADDRESS_REGEX.test(address);

export const checkFileFormat = (file: File, types: string | string[] = FILE_TYPES.WASM) => {
  if (Array.isArray(types)) {
    return types.some((type) => type === file.type);
  }

  return types === file.type;
};

export const getPreformattedText = (data: unknown) => JSON.stringify(data, null, 4);

export const isHex = (value: unknown) => {
  const hexRegex = /^0x[\da-fA-F]+/;

  return isString(value) && hexRegex.test(value);
};
