import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { WASM_FILE_TYPE } from '../consts';
import { WasmFileType } from '../types';
import { useWasmFileHandler } from './use-wasm-file-handler';

type Location = {
  state: {
    file: File | undefined;
    buffer: Buffer | undefined;
  } | null;
};

// upload-code/program feature?
function useWasmFile(type: WasmFileType = WASM_FILE_TYPE.PROGRAM) {
  const { state } = useLocation() as Location;

  const [file, setFile] = useState(state?.file);

  // browser's history api serizalizes Buffer instance, therefore we need to convert it
  const [buffer, setBuffer] = useState(state?.buffer || undefined);

  const handleFileChange = useWasmFileHandler(type, (value, bufferValue) => {
    setFile(value);
    setBuffer(bufferValue);
  });

  const resetFile = () => {
    setFile(undefined);
    setBuffer(undefined);
  };

  return { value: file, buffer, reset: resetFile, handleChange: handleFileChange };
}

export { useWasmFile };
