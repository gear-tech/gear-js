import { Hex, ProgramMetadata, getProgramMetadata, getStateMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { getLocalProgramMeta, fetchMetadata, fetchStates, fetchState, addState } from 'api';
import { useChain } from 'hooks';
import { readFileAsync, resetFileInput } from 'shared/helpers';
import { getPayloadFormValues } from 'features/formPayload';
import {} from 'shared/config';

import { IState } from '../model';
import { IFunctions } from '../model/types';

const useStateType = () => {
  const location = useLocation();

  const [, , type] = location.pathname.split('/');
  const isFull = type === 'full';
  const isWasm = type === 'wasm';
  const isSelection = !isFull && !isWasm;

  return { stateType: type, isFullState: isFull, isWasmState: isWasm, isStateTypeSelection: isSelection };
};

const useMetadataAndStates = (programId: Hex) => {
  const alert = useAlert();

  const { isDevChain } = useChain();
  const getMetadata = isDevChain ? getLocalProgramMeta : fetchMetadata;

  const [metadata, setMetadata] = useState<ProgramMetadata>();

  const [states, setStates] = useState<IState[]>([]);
  const [isEachStateReady, setIsEachStateReady] = useState(false);

  useEffect(() => {
    Promise.all([getMetadata(programId), fetchStates(programId)])
      .then(([{ result: metaResult }, { result: statesResult }]) => {
        setMetadata(getProgramMetadata(metaResult.hex));
        setStates(statesResult.states);
      })
      .catch(({ message }: Error) => alert.error(message))
      .finally(() => setIsEachStateReady(true));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

  const searchStates = (query: string) => {
    setIsEachStateReady(false);

    fetchStates(programId, query)
      .then(({ result }) => setStates(result.states))
      .catch(({ message }: Error) => alert.error(message))
      .finally(() => setIsEachStateReady(true));
  };

  const getBase64 = (file: File) =>
    readFileAsync(file, 'buffer')
      .then((ArrayBuffer) => Buffer.from(ArrayBuffer))
      .then((buffer) => buffer.toString('base64'));

  const uploadState = (file: File) => {
    setIsEachStateReady(false);

    return getBase64(file)
      .then((wasmBuffBase64) => addState({ programId, wasmBuffBase64, name: file.name }))
      .then(({ result }) => setStates((prevStates) => (prevStates ? [...prevStates, result.state] : prevStates)))
      .catch(({ message }: Error) => alert.error(message))
      .finally(() => setIsEachStateReady(true));
  };

  return { metadata, states, isEachStateReady, searchStates, uploadState };
};

const useStateSelection = (metadata: ProgramMetadata | undefined) => {
  const alert = useAlert();

  const [selectedState, setSelectedState] = useState<IState>();
  const selectedStateId = selectedState?.id;

  const [selectedFunction, setSelectedFunction] = useState({ id: '', isFileFunction: false });
  const functionId = selectedFunction.id;

  const { functions } = selectedState || {};
  const functionTypes = functions?.[functionId];
  const typeIndex = functionTypes?.input;
  const isTypeIndex = typeIndex !== undefined && typeIndex !== null;

  const payloadFormValues = useMemo(
    () => (metadata && isTypeIndex ? getPayloadFormValues(metadata, typeIndex) : undefined),
    [metadata, isTypeIndex, typeIndex],
  );

  const [wasmBuffer, setWasmBuffer] = useState<Buffer>();

  useEffect(() => {
    if (selectedStateId) {
      setWasmBuffer(undefined); // to trigger loader

      fetchState(selectedStateId)
        .then(({ result }) => setWasmBuffer(Buffer.from(result.wasmBuffBase64, 'base64')))
        .catch(({ message }: Error) => alert.error(message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStateId]);

  const resetFunction = () => setSelectedFunction({ id: '', isFileFunction: false });
  const resetSelectedState = () => setSelectedState(undefined);

  return {
    functionId,
    isFileFunction: selectedFunction.isFileFunction,
    typeIndex,
    payloadFormValues,
    wasmBuffer,
    resetFunction,
    resetSelectedState,
    selectState: setSelectedState,
    selectFunction: setSelectedFunction,
  };
};

const useFileFunctions = () => {
  const alert = useAlert();

  const [fileFunctions, setFileFunctions] = useState<IFunctions>();
  const [wasmFile, setWasmFile] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetWasmFile = () => setWasmFile(undefined);

  useEffect(() => {
    if (wasmFile) {
      readFileAsync(wasmFile, 'buffer').then((result) => {
        const buffer = Buffer.from(result);

        getStateMetadata(buffer)
          .then(({ functions }) => setFileFunctions(functions))
          .catch(({ message }: Error) => {
            alert.error(message);
            resetWasmFile();
            resetFileInput(fileInputRef.current);
          });
      });
    }
  }, [alert, wasmFile]);

  return { fileFunctions, fileInputRef, wasmFile, resetWasmFile, selectWasmFile: setWasmFile };
};

export { useStateType, useMetadataAndStates, useStateSelection, useFileFunctions };
