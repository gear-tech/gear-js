import { getStateMetadata, StateFunctions } from '@gear-js/api';
import { Button, FileInput, Input, Textarea } from '@gear-js/ui';
import { useAlert } from '@gear-js/react-hooks';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import { addState, fetchState, fetchStates } from 'api';
import { useStateRead } from 'hooks';
import { FileTypes } from 'shared/config';
import { checkFileFormat, getPreformattedText, readFileAsync, resetFileInput } from 'shared/helpers';
import { BackButton } from 'shared/ui/backButton';
import { Box } from 'shared/ui/box';
import { FormPayload, getPayloadFormValues, getSubmitPayload } from 'features/formPayload';
import { ReactComponent as ReadSVG } from 'shared/assets/images/actions/read.svg';

import { IState, FormValues, INITIAL_VALUES } from '../../model';
import { useProgramId, useMetadata } from '../../hooks';
import { WasmStates } from '../wasmStates';
import styles from './Wasm.module.scss';

const Wasm = () => {
  const alert = useAlert();

  const programId = useProgramId();
  const metadata = useMetadata(programId);
  const { state, isStateRead, isState, readWasmState, resetState } = useStateRead(programId);

  const [uploadedStates, setUploadedStates] = useState<IState[]>([]);
  const [fileFunctions, setFileFunctions] = useState<StateFunctions>();

  const [uploadedWasmBuffer, setUploadedWasmBuffer] = useState<Buffer>();
  const [fileWasmBuffer, setFileWasmBuffer] = useState<Buffer>();

  const [isStateRequestReady, setIsStatesRequestReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedState, setUploadedState] = useState<IState>();
  const uploadedStateId = uploadedState?.id;

  const [selectedFunction, setSelectedFunction] = useState({ id: '', name: '', isFileFunction: false });
  const { isFileFunction } = selectedFunction;
  const functionId = selectedFunction.id;
  const functionName = selectedFunction.name;

  const uploadedFunctions = uploadedState?.functions;
  const functions = isFileFunction ? fileFunctions : uploadedFunctions;
  const functionTypes = functions?.[functionName];
  const typeIndex = functionTypes?.input;
  const isTypeIndex = typeIndex !== undefined && typeIndex !== null;

  const payloadFormValues = useMemo(
    () => (metadata && isTypeIndex ? getPayloadFormValues(metadata, typeIndex) : undefined),
    [metadata, isTypeIndex, typeIndex],
  );

  // const resetStateWasmBuffer = () => setStateWasmBuffer(undefined);
  const resetFileInputValue = () => resetFileInput(fileInputRef.current);

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const [file] = target.files || [];

    if (file && !checkFileFormat(file, FileTypes.Wasm)) {
      alert.error('Wrong file format');

      // TODO: remove after @gear-js/ui update,
      // onChange should be called before inner setState
      resetFileInputValue();

      return;
    }

    readFileAsync(file, 'buffer')
      .then((arrayBuffer) => Buffer.from(arrayBuffer))
      .then(async (buffer) => ({ stateMeta: await getStateMetadata(buffer), buffer }))
      .then(({ stateMeta, buffer }) => {
        setFileFunctions(stateMeta.functions);
        setFileWasmBuffer(buffer);
      })
      .catch(({ message }: Error) => {
        alert.error(message);
        resetFileInputValue();
      });
  };

  useEffect(() => {
    fetchStates(programId)
      .then(({ result }) => setUploadedStates(result.states))
      .catch(({ message }: Error) => alert.error(message))
      .finally(() => setIsStatesRequestReady(true));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (uploadedStateId) {
      setUploadedWasmBuffer(undefined); // to trigger loader

      fetchState(uploadedStateId)
        .then(({ result }) => Buffer.from(result.wasmBuffBase64, 'base64'))
        .then((buffer) => setUploadedWasmBuffer(buffer))
        .catch(({ message }: Error) => alert.error(message));
    }
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
    if (!fileWasmBuffer) return;

    setIsStatesRequestReady(false);

    const [file] = fileInputRef.current?.files || [];

    return addState({ programId, wasmBuffBase64: fileWasmBuffer.toString('base64'), name: file.name })
      .then(({ result }) =>
        setUploadedStates((prevStates) => (prevStates ? [...prevStates, result.state] : prevStates)),
      )
      .catch(({ message }: Error) => alert.error(message))
      .finally(() => setIsStatesRequestReady(true));
  };

  const handleSubmit = (values: FormValues) => {
    const payload = getSubmitPayload(values.payload);

    if (isFileFunction) {
      if (!fileWasmBuffer) return;

      readWasmState(fileWasmBuffer, functionName, payload);
    } else {
      if (!uploadedWasmBuffer) return;

      readWasmState(uploadedWasmBuffer, functionName, payload);
    }
  };

  const isUploadedFunctionSelected = !!functionName && !isFileFunction;
  const isLoading = !metadata || (isUploadedFunctionSelected && !uploadedWasmBuffer);

  return (
    <>
      <Form initialValues={INITIAL_VALUES} onSubmit={handleSubmit} validateOnBlur>
        {(formApi) => (
          <form id="state" onSubmit={formApi.handleSubmit}>
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
                ref={fileInputRef}
                size="large"
                // TODO: remove after @gear-js/ui update
                // @ts-ignore
                color="secondary"
                className={styles.input}
                onChange={handleInputChange}
              />

              <BackButton />
            </div>
          </form>
        )}
      </Form>

      <WasmStates
        uploadedStates={uploadedStates}
        fileFunctions={fileFunctions ? Object.keys(fileFunctions) : []}
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
