import { Hex } from '@gear-js/api';
import { Metadata } from '@polkadot/types';
import isString from 'lodash.isstring';
import isPlainObject from 'lodash.isplainobject';
import { AlertContainerFactory } from 'context/alert/types';
import { localPrograms } from 'services/LocalDBService';
import { GetMetaResponse } from 'api/responses';
import { DEVELOPMENT_CHAIN, LOCAL_STORAGE, FILE_TYPES } from 'consts';
import { NODE_ADDRESS_REGEX } from 'regexes';
import { FormValues as SendMessageInitialValues } from './components/pages/Send/children/MessageForm/types';
import { FormValues as UploadInitialValues } from './components/pages/Programs/children/Upload/children/UploadForm/types';
import { ProgramModel, ProgramPaginationModel, ProgramStatus } from 'types/program';
import { getSubmitPayload } from 'components/common/Form/FormPayload/helpers';

export const fileNameHandler = (filename: string) => {
  const transformedFileName = filename;

  return transformedFileName.length > 24
    ? `${transformedFileName.slice(0, 12)}…${transformedFileName.slice(-12)}`
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

export const toShortAddress = (_address: string) => {
  const address = (_address || '').toString();

  return address.length > 13 ? `${address.slice(0, 6)}…${address.slice(-6)}` : address;
};

export const copyToClipboard = (key: string, alert: any, successfulText?: string) => {
  try {
    navigator.clipboard.writeText(key);
    alert.success(successfulText || 'Copied');
  } catch (err) {
    alert.error('Copy error');
  }
};

export const signPayload = async (injector: any, address: string, payload: any, callback: any) => {
  try {
    const { signature } = await injector.signer.signRaw!({
      address,
      data: payload,
      type: 'payload',
    });

    callback(signature);
  } catch (err) {
    console.error(err);
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

export const calculateGas = async (
  method: string,
  api: any,
  values: UploadInitialValues['programValues'] | SendMessageInitialValues,
  alert: AlertContainerFactory,
  meta: any,
  code?: Uint8Array | null,
  addressId?: String | null,
  replyCodeError?: string
): Promise<number> => {
  const payload = getSubmitPayload(values.payload);

  try {
    if (isString(payload) && payload === '') {
      throw new Error("payload can't be empty");
    }

    if (isPlainObject(payload) && Object.keys(payload as object).length === 0) {
      throw new Error(`form can't be empty`);
    }

    const { value } = values;
    const metaOrTypeOfPayload: Metadata | string = meta || 'String';

    let estimatedGas;

    switch (method) {
      case 'init':
        estimatedGas = await api.program.gasSpent.init(
          localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW) as Hex,
          code,
          payload,
          value,
          metaOrTypeOfPayload
        );
        break;
      case 'handle':
        estimatedGas = await api.program.gasSpent.handle(
          localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW) as Hex,
          addressId,
          payload,
          value,
          metaOrTypeOfPayload
        );
        break;
      case 'reply':
        estimatedGas = await api.program.gasSpent.reply(
          localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW) as Hex,
          addressId,
          Number(replyCodeError),
          payload,
          value,
          metaOrTypeOfPayload
        );
        break;
    }

    alert.info(`Estimated gas ${estimatedGas.toHuman()}`);

    return estimatedGas.toNumber();
  } catch (error) {
    alert.error(`${error}`);

    return Promise.reject(error);
  }
};

export const isHex = (value: unknown) => {
  const hexRegex = /^0x[\da-fA-F]+/;

  return isString(value) && hexRegex.test(value);
};
