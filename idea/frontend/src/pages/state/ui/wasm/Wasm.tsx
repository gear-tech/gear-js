import { getStateMetadata, StateFunctions, StateMetadata } from '@gear-js/api';
import { Button, FileInput, Input, Textarea } from '@gear-js/ui';
import { useAlert } from '@gear-js/react-hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { FormApi } from 'final-form';

import { addState, fetchState, fetchStates } from 'api';
import { useChain, useProgram, useStateRead } from 'hooks';
import { getPreformattedText, isNullOrUndefined, readFileAsync } from 'shared/helpers';
import { FileTypes } from 'shared/config';
import { BackButton } from 'shared/ui/backButton';
import { Box } from 'shared/ui/box';
import { FormPayload, getPayloadFormValues, getSubmitPayload } from 'features/formPayload';
import { ReactComponent as ReadSVG } from 'shared/assets/images/actions/read.svg';
import { isHumanTypesRepr, useMetadata } from 'features/metadata';

import { downloadJson } from '../../helpers';
import { IState, WasmFormValues, INITIAL_VALUES } from '../../model';
import { useProgramId } from '../../hooks';
import { WasmStates } from '../wasmStates';
import styles from './Wasm.module.scss';

const Wasm = () => {
  const { isDevChain } = useChain();
  const alert = useAlert();

  const programId = useProgramId();
  const { program } = useProgram(programId);
  const { metadata: programMetadata } = useMetadata(program?.metahash);

  const { state, isStateRead, isState, readWasmState, resetState } = useStateRead(programId);

  const [metadata, setMetadata] = useState<StateMetadata>();
  const [isStateRequestReady, setIsStatesRequestReady] = useState(!!isDevChain);

  const [file, setFile] = useState<File>();
  const [fileWasmBuffer, setFileWasmBuffer] = useState<Buffer>();
  const [fileFunctions, setFileFunctions] = useState<StateFunctions>();

  const [uploadedStates, setUploadedStates] = useState<IState[]>([]);
  const [uploadedState, setUploadedState] = useState<IState>();
  const [uploadedWasmBuffer, setUploadedWasmBuffer] = useState<Buffer>();

  const [selectedFunction, setSelectedFunction] = useState({ id: '', name: '', isFileFunction: false });

  const uploadedStateId = uploadedState?.id;

  const { isFileFunction } = selectedFunction;
  const functionId = selectedFunction.id;
  const functionName = selectedFunction.name;
  const wasmBuffer = isFileFunction ? fileWasmBuffer : uploadedWasmBuffer;
  const isUploadedFunctionSelected = !!functionName && !isFileFunction;

  const uploadedFunctions = uploadedState?.functions;
  const functions = isFileFunction ? fileFunctions : uploadedFunctions;
  const functionTypes = functions?.[functionName];
  const functionTypeIndex = functionTypes?.input;

  const formApi = useRef<FormApi<WasmFormValues>>();

  const payloadFormValues = useMemo(
    () =>
      programMetadata &&
      isHumanTypesRepr(programMetadata.types.state) &&
      !isNullOrUndefined(programMetadata.types.state.input)
        ? getPayloadFormValues(programMetadata, programMetadata.types.state.input)
        : undefined,
    [programMetadata],
  );

  const argumentFormValues = useMemo(
    () =>
      metadata && !isNullOrUndefined(functionTypeIndex) ? getPayloadFormValues(metadata, functionTypeIndex) : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metadata, functionId],
  );

  const resetFile = () => setFile(undefined);

  useEffect(() => {
    if (isDevChain) return;

    fetchStates(programId)
      .then(({ result }) => setUploadedStates(result.states))
      .catch(({ message }: Error) => alert.error(message))
      .finally(() => setIsStatesRequestReady(true));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!uploadedStateId) return;

    fetchState(uploadedStateId)
      .then(({ result }) => Buffer.from(result.wasmBuffBase64, 'base64'))
      .then((buffer) => setUploadedWasmBuffer(buffer))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedStateId]);

  const searchStates = (query: string) => {
    setIsStatesRequestReady(false);

    fetchStates(programId, query)
      .then(({ result }) => setUploadedStates(result.states))
      .catch(({ message }: Error) => alert.error(message))
      .finally(() => setIsStatesRequestReady(true));
  };

  const uploadState = () => {
    if (!file || !fileWasmBuffer) return;

    setIsStatesRequestReady(false);

    const { name } = file;
    const wasmBuffBase64 = fileWasmBuffer.toString('base64');

    return addState({ programId, wasmBuffBase64, name })
      .then(({ result }) => {
        setUploadedStates((prevStates) => [...prevStates, result.state]);
        resetFile();
      })
      .catch(({ message }: Error) => alert.error(message))
      .finally(() => setIsStatesRequestReady(true));
  };

  const handleSubmit = (values: WasmFormValues) => {
    if (!wasmBuffer || !programMetadata) return;

    const payload = getSubmitPayload(values.payload);
    const argument = getSubmitPayload(values.argument);

    readWasmState(wasmBuffer, programMetadata, functionName, argument, payload || '0x');
  };

  const setFileBufferAndFunctions = (value: File) => {
    readFileAsync(value, 'buffer')
      .then((arrayBuffer) => Buffer.from(arrayBuffer))
      .then(async (buffer) => ({ stateMeta: await getStateMetadata(buffer), buffer }))
      .then(({ stateMeta, buffer }) => {
        setFileFunctions(stateMeta.functions);
        setFileWasmBuffer(buffer);
      })
      .catch(({ message }: Error) => {
        alert.error(message);
        resetFile();
      });
  };

  const resetFileBufferAndFunctions = () => {
    setFileFunctions(undefined);
    setFileWasmBuffer(undefined);
  };

  const resetSelectedFunction = () => setSelectedFunction({ id: '', name: '', isFileFunction: false });

  useEffect(() => {
    if (file) {
      setFileBufferAndFunctions(file);
    } else {
      resetFileBufferAndFunctions();
    }

    resetSelectedFunction();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const resetUploadedState = () => setUploadedState(undefined);
  const resetUploadedWasmBuffer = () => setUploadedWasmBuffer(undefined);
  const resetPayloadValue = () => formApi.current?.change('payload', payloadFormValues?.payload);
  const resetArgumentValue = () => formApi.current?.change('argument', argumentFormValues?.payload);
  const resetMetadata = () => setMetadata(undefined);

  useEffect(() => {
    resetSelectedFunction();
  }, [uploadedStates]);

  useEffect(() => {
    if (!functionId) {
      resetUploadedState();
      resetUploadedWasmBuffer();
    }

    resetState();
    resetPayloadValue();
    resetArgumentValue();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [functionId]);

  useEffect(() => {
    if (!wasmBuffer) return resetMetadata();

    getStateMetadata(wasmBuffer)
      .then((result) => setMetadata(result))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFileFunction, uploadedStateId, wasmBuffer]);

  const isFunctionSelected = !!functionName;
  const isArgumentFormReady = !(isUploadedFunctionSelected && !metadata);
  const isPayloadFormReady = !!programMetadata;

  return (
    <>
      <Form initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        {(formProps) => {
          formApi.current = formProps.form;

          return (
            <form id="state" onSubmit={formProps.handleSubmit}>
              <Box className={styles.box}>
                <Input label="Program ID:" gap="1/5" value={programId} readOnly />

                {isArgumentFormReady ? (
                  argumentFormValues && (
                    <FormPayload name="argument" label="Argument" values={argumentFormValues} gap="1/5" />
                  )
                ) : (
                  <Textarea label="Argument:" gap="1/5" className={styles.loading} readOnly block />
                )}

                {isFunctionSelected &&
                  (isPayloadFormReady ? (
                    payloadFormValues && (
                      <FormPayload name="payload" label="Payload" values={payloadFormValues} gap="1/5" />
                    )
                  ) : (
                    <Textarea label="Payload:" gap="1/5" className={styles.loading} readOnly block />
                  ))}

                <OnChange name="payload">{() => resetState()}</OnChange>
                <OnChange name="argument">{() => resetState()}</OnChange>

                {isStateRead ? (
                  isState && (
                    <Textarea
                      label="Statedata:"
                      rows={15}
                      gap="1/5"
                      value={getPreformattedText(state)}
                      readOnly
                      block
                    />
                  )
                ) : (
                  <Textarea label="Statedata:" rows={15} gap="1/5" value="" className={styles.loading} readOnly block />
                )}
              </Box>

              <div className={styles.buttons}>
                {isFunctionSelected && isArgumentFormReady && isPayloadFormReady && (
                  <Button type="submit" form="state" color="secondary" text="Read" icon={ReadSVG} size="large" />
                )}

                <FileInput
                  value={file}
                  size="large"
                  color="secondary"
                  className={styles.input}
                  onChange={setFile}
                  accept={FileTypes.Wasm}
                />

                {isStateRead && isState && (
                  <Button text="Download JSON" color="secondary" size="large" onClick={() => downloadJson(state)} />
                )}

                <BackButton />
              </div>
            </form>
          );
        }}
      </Form>

      <WasmStates
        uploadedStates={uploadedStates}
        fileFunctions={fileFunctions ? Object.keys(fileFunctions) : undefined}
        value={functionId}
        isStateRequestReady={isStateRequestReady}
        onStateChange={setUploadedState}
        onFunctionChange={setSelectedFunction}
        onSearchSubmit={searchStates}
        onUploadButtonClick={uploadState}
      />
    </>
  );
};

export { Wasm };
