import { Hex, ProgramMetadata, getProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { useState, useEffect, ChangeEvent } from 'react';
import { useLocation } from 'react-router-dom';

import { getLocalProgramMeta, fetchMetadata, fetchStates, fetchState, addState } from 'api';
import { useChain } from 'hooks';
import { readFileAsync } from 'shared/helpers';
import { getPayloadFormValues } from 'features/formPayload';

import { IState } from '../model';

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
  const [states, setStates] = useState<IState[]>();

  useEffect(() => {
    Promise.all([getMetadata(programId), fetchStates(programId)])
      .then(([{ result: metaResult }, { result: statesResult }]) => {
        setMetadata(getProgramMetadata(metaResult.hex));
        setStates(statesResult.states);
      })
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

  return { metadata, states };
};

const useStateWasm = (programId: Hex, stateId: string | undefined) => {
  const [wasmBuffer, setWasmBuffer] = useState<Buffer>();

  useEffect(() => {
    if (stateId) {
      fetchState(stateId).then(({ result }) => setWasmBuffer(Buffer.from(result.wasmBuffBase64, 'base64')));
    }
  }, [stateId]);

  const getBase64 = (file: File) =>
    readFileAsync(file, 'buffer')
      .then((ArrayBuffer) => Buffer.from(ArrayBuffer))
      .then((buffer) => buffer.toString('base64'));

  const uploadWasmBuffer = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const [file] = target.files || [];

    if (file) {
      getBase64(file).then((wasmBuffBase64) => addState({ programId, wasmBuffBase64, name: file.name }));
    }
  };

  return { wasmBuffer, uploadWasmBuffer };
};

const useStateSelection = (metadata: ProgramMetadata | undefined) => {
  const [selectedState, setSelectedState] = useState<IState>();
  const selectedStateId = selectedState?.id;

  const [functionId, setFunctionId] = useState('');

  const { functions } = selectedState || {};
  const selectedFunction = functions?.[functionId];
  const typeIndex = selectedFunction?.input;
  const isTypeIndex = typeIndex !== undefined && typeIndex !== null;

  const payloadFormValues = metadata && isTypeIndex ? getPayloadFormValues(metadata, typeIndex) : undefined;

  return {
    selectedStateId,
    functionId,
    typeIndex,
    selectState: setSelectedState,
    selectFunction: setFunctionId,
    payloadFormValues,
  };
};

export { useStateType, useMetadataAndStates, useStateWasm, useStateSelection };
