import { getStateMetadata, StateFunctions, StateMetadata } from '@gear-js/api';
import { Button, FileInput, Input, Textarea } from '@gear-js/ui';
import { useAlert } from '@gear-js/react-hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { FormApi } from 'final-form';

import { addState, fetchState, fetchStates } from 'api';
import { useChain, useStateRead } from 'hooks';
import { getPreformattedText, readFileAsync } from 'shared/helpers';
import { FileTypes } from 'shared/config';
import { BackButton } from 'shared/ui/backButton';
import { Box } from 'shared/ui/box';
import { FormPayload, getPayloadFormValues, getSubmitPayload } from 'features/formPayload';
import { ReactComponent as ReadSVG } from 'shared/assets/images/actions/read.svg';

import { downloadJson } from '../../helpers';
import { IState, FormValues, INITIAL_VALUES } from '../../model';
import { useProgramId } from '../../hooks';
import { WasmStates } from '../wasmStates';
import styles from './Wasm.module.scss';

const Wasm = () => {
  const { isDevChain } = useChain();
  const alert = useAlert();

  const programId = useProgramId();
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

  const uploadedFunctions = uploadedState?.functions;
  const functions = isFileFunction ? fileFunctions : uploadedFunctions;
  const functionTypes = functions?.[functionName];
  const typeIndex = functionTypes?.input;
  const isTypeIndex = typeIndex !== undefined && typeIndex !== null;

  const formApi = useRef<FormApi<FormValues>>();

  const payloadFormValues = useMemo(
    () => (metadata && isTypeIndex ? getPayloadFormValues(metadata, typeIndex) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metadata, isTypeIndex, typeIndex, functionId],
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

  const handleSubmit = (values: FormValues) => {
    if (!wasmBuffer) return;

    const payload = getSubmitPayload(values.payload);

    readWasmState(wasmBuffer, functionName, payload);
  };

  const isUploadedFunctionSelected = !!functionName && !isFileFunction;
  const isLoading = !metadata || (isUploadedFunctionSelected && !uploadedWasmBuffer);

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [functionId]);

  useEffect(() => {
    if (!wasmBuffer) return resetMetadata();

    getStateMetadata(wasmBuffer)
      .then((result) => setMetadata(result))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFileFunction, uploadedStateId, wasmBuffer]);

  const handleDownloadJsonButtonClick = () => downloadJson(state);

  return (
    <>
      <Form initialValues={INITIAL_VALUES} onSubmit={handleSubmit} validateOnBlur>
        {(formProps) => {
          formApi.current = formProps.form;

          return (
            <form id="state" onSubmit={formProps.handleSubmit}>
              <Box className={styles.box}>
                <Input label="Program ID:" gap="1/5" value={programId} readOnly />

                {payloadFormValues &&
                  (isLoading ? (
                    <Textarea label="Payload" gap="1/5" className={styles.loading} readOnly />
                  ) : (
                    <FormPayload name="payload" label="Input Parameters" values={payloadFormValues} gap="1/5" />
                  ))}

                <OnChange name="payload">{() => resetState()}</OnChange>
                {!isStateRead && (
                  <Textarea label="Statedata:" rows={15} gap="1/5" className={styles.loading} readOnly block />
                )}

                {isStateRead && isState && (
                  <Textarea label="Statedata:" rows={15} gap="1/5" value={getPreformattedText(state)} readOnly block />
                )}
              </Box>

              <div className={styles.buttons}>
                {functionName && (
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
                  <Button text="Download JSON" color="secondary" size="large" onClick={handleDownloadJsonButtonClick} />
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
