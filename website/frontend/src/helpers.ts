import { Hex } from '@gear-js/api';
import { Metadata } from '@polkadot/types';
import { AlertContainer } from 'react-alert';
import { localPrograms } from 'services/LocalDBService';
import { GetMetaResponse } from 'api/responses';
import { DEVELOPMENT_CHAIN, LOCAL_STORAGE } from 'consts';
import { NODE_ADDRESS_REGEX } from 'regexes';
import { InitialValues as SendMessageInitialValues } from './components/pages/Send/children/MessageForm/types';
import { InitialValues as UploadInitialValues } from './components/pages/Programs/children/Upload/children/UploadForm/types';
import { SetFieldValue } from 'types/common';
import { ProgramModel, ProgramPaginationModel, ProgramStatus } from 'types/program';

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

      if (params.term) {
        if (
          (elem.name?.includes(params.term) || elem.id?.includes(params.term)) &&
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
      data.result.programs.sort((prev, next) => (prev.timestamp > next.timestamp ? -1 : 1));

      return data;
    });
};

export const getLocalProgram = (id: string) => {
  const result: ProgramModel = {
    id: '',
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

export const checkFileFormat = (file: File) => {
  const fileExt = file.name.split('.').pop()?.toLowerCase();

  return fileExt === 'wasm';
};

export const getPreformattedText = (data: unknown) => JSON.stringify(data, null, 4);

export const calculateGas = async (
  method: string,
  api: any,
  isManualPayload: boolean,
  values: UploadInitialValues | SendMessageInitialValues,
  setFieldValue: SetFieldValue,
  alert: AlertContainer,
  meta: any,
  code?: Uint8Array | null,
  addressId?: String | null,
  replyCodeError?: string
) => {
  const payload = isManualPayload ? values.payload : values.__root;

  if (isManualPayload && payload === '') {
    alert.error(`Error: payload can't be empty`);
    return;
  }

  if (!isManualPayload && payload && Object.keys(payload).length === 0) {
    alert.error(`Error: form can't be empty`);
    return;
  }

  try {
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
    setFieldValue('gasLimit', estimatedGas.toNumber());
  } catch (error) {
    alert.error(`${error}`);
  }
};

export const isHex = (value: unknown) => {
  const isString = typeof value === 'string';
  const hexRegex = /^0x[\da-fA-F]+/;
  return isString && hexRegex.test(value);
};
