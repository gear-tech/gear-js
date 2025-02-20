import { HexString, generateCodeHash } from '@gear-js/api';
import { useApi, useAlert } from '@gear-js/react-hooks';
import { generatePath } from 'react-router-dom';

import { FileTypes, routes } from '@/shared/config';
import { CustomLink } from '@/shared/ui/customLink';

import { WASM_FILE_TYPE } from '../consts';
import { WasmFileType } from '../types';

type OnChange = (value: File | undefined, buffer: Buffer | undefined) => void;

// upload-code feature?
function useWasmFileHandler(type: WasmFileType, onChange: OnChange = () => {}) {
  const { api, isApiReady } = useApi();
  const alert = useAlert();

  const renderCodeExistsAlert = (codeId: HexString) => (
    <>
      <p>Code already exists</p>
      <p>
        ID: <CustomLink to={generatePath(routes.code, { codeId })} text={codeId} />
      </p>
    </>
  );

  return async (value: File | undefined) => {
    if (!value) return onChange(undefined, undefined);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison -- TODO(#1800): resolve eslint comments
    if (value.type !== FileTypes.Wasm) return alert.error('Invalid file type');

    const arrayBuffer = await value.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (type === WASM_FILE_TYPE.CODE) {
      if (!isApiReady) throw new Error('API is not initialized');

      const codeId = generateCodeHash(buffer);
      const isCodeExists = await api.code.exists(codeId);

      if (isCodeExists) return alert.error(renderCodeExistsAlert(codeId));
    }

    onChange(value, buffer);
  };
}

export { useWasmFileHandler };
