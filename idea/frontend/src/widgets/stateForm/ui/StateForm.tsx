import { Button, FileInput, Input, Textarea } from '@gear-js/ui';
import { Hex, ProgramMetadata } from '@gear-js/api';
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { generatePath, useLocation } from 'react-router-dom';
import { OnChange } from 'react-final-form-listeners';

import { addState } from 'api';
import { BackButton } from 'shared/ui/backButton';
import { Box } from 'shared/ui/box';
import { ReactComponent as ReadSVG } from 'shared/assets/images/actions/read.svg';
import { ReactComponent as ApplySVG } from 'shared/assets/images/actions/apply.svg';
import { FormPayload, getPayloadFormValues, getSubmitPayload } from 'features/formPayload';
import { getPreformattedText, readFileAsync } from 'shared/helpers';
import { useModal, useStateRead } from 'hooks';
import { UILink } from 'shared/ui/uiLink';
import { IState } from 'pages/state/model';

import { FormValues, INITIAL_VALUES } from '../model';
import styles from './StateForm.module.scss';

type Props = {
  meta: ProgramMetadata | undefined;
  programId: Hex;
  isLoading: boolean;
};

const StateForm = ({ meta, programId, isLoading }: Props) => {
  const { showModal } = useModal();

  const { state, isReaded, readState, resetState } = useStateRead(programId, meta);
  const isState = state !== undefined; // could be null

  const location = useLocation();
  const [, , stateType] = location.pathname.split('/');

  const handleSubmit = async (values: FormValues) => {
    const payload = getSubmitPayload(values.payload);

    await readState(payload);
  };

  // const encodeType = meta?.meta_state_input;

  // const payloadFormValues = useMemo(() => getPayloadFormValues(meta, encodeType), [meta, encodeType]);
  const payloadFormValues = undefined;

  // useEffect(() => {
  //   if (meta && !encodeType) readState();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [meta, encodeType]);

  const getBase64 = (file: File) =>
    readFileAsync(file, 'buffer')
      .then((ArrayBuffer) => Buffer.from(ArrayBuffer))
      .then((buffer) => buffer.toString('base64'));

  const uploadState = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const [file] = target.files || [];

    if (file) {
      getBase64(file).then((wasmBuffBase64) => addState({ programId, wasmBuffBase64, name: file.name }));
    }
  };

  // const onStateUpload = (file: File) => navigate(absoluteRoutes.uploadProgram, { state: { file } });
  // const openUploadStateModal = () => showModal('uploadFile', { name: 'state', onUpload: uploadState });

  const isFull = stateType === 'full';
  const isWasm = stateType === 'wasm';
  const isSelection = !isWasm && !isFull;

  return (
    <Form initialValues={INITIAL_VALUES} onSubmit={handleSubmit} validateOnBlur>
      {(formApi) => (
        <form onSubmit={formApi.handleSubmit}>
          <Box className={styles.body}>
            {isLoading ? (
              <Input label="Program ID:" gap="1/5" className={styles.loading} value="" readOnly />
            ) : (
              <Input label="Program ID:" gap="1/5" value={programId} readOnly />
            )}

            {/* {payloadFormValues &&
              (isLoading ? (
                <Textarea label="Payload" gap="1/5" className={styles.loading} readOnly />
              ) : (
                <FormPayload name="payload" label="Input Parameters" values={payloadFormValues} gap="1/5" />
              ))} */}

            <OnChange name="payload">{() => resetState()}</OnChange>
            {!isReaded && <Textarea label="Statedata:" rows={15} gap="1/5" className={styles.loading} readOnly block />}

            {isReaded && isState && (
              <Textarea label="Statedata:" rows={15} gap="1/5" value={getPreformattedText(state)} readOnly block />
            )}
          </Box>

          {isSelection && (
            <>
              <h3 className={styles.buttonsHeading}>Choose how to read state:</h3>
              <div className={styles.buttons}>
                <UILink
                  to={generatePath('/state/full/:programId', { programId })}
                  text="Read full state"
                  color="secondary"
                  size="large"
                  icon={ReadSVG}
                />
                <UILink
                  to={generatePath('/state/wasm/:programId', { programId })}
                  text="Read state using wasm"
                  color="secondary"
                  size="large"
                  icon={ApplySVG}
                />
                <BackButton />
              </div>
            </>
          )}

          {isWasm && (
            <div className={styles.buttons}>
              <FileInput size="large" color="primary" onChange={uploadState} />
              <BackButton />
            </div>
          )}

          {isFull && <BackButton />}
        </form>
      )}
    </Form>
  );
};

export { StateForm };
