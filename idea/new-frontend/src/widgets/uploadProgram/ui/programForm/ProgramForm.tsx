import { useState, useMemo, useRef, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormApi } from 'final-form';
import { Form } from 'react-final-form';
import clsx from 'clsx';
import { Metadata } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { FileInput, Button } from '@gear-js/ui';

import { useProgramActions, useGasCalculate, useChangeEffect } from 'hooks';
import { Result } from 'hooks/useGasCalculate/types';
import { Payload } from 'hooks/useProgramActions/types';
import { FormPayload, getSubmitPayload, getPayloadFormValues } from 'features/formPayload';
import { FormPayloadType } from 'features/formPayloadType';
import { GasField } from 'features/gasField';
import { GasInfoCard } from 'entities/gasInfo';
import { GasMethod, routes } from 'shared/config';
import { getValidation } from 'shared/helpers';
import { FormInput, formStyles } from 'shared/ui/form';
import { Box } from 'shared/ui/box';
import plusSVG from 'shared/assets/images/actions/plus.svg';
import closeSVG from 'shared/assets/images/actions/close.svg';

import styles from './ProgramForm.module.scss';
import { getValidationSchema } from '../../helpers';
import { INITIAL_VALUES, FormValues } from '../../model';

type Props = {
  file: File;
  fileBuffer: Buffer;
  metadata?: Metadata;
  metadataBuffer?: string;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const ProgramForm = ({ file, fileBuffer, metadata, metadataBuffer, onFileChange }: Props) => {
  const { api } = useApi();
  const navigate = useNavigate();

  const formApi = useRef<FormApi<FormValues>>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [gasInfo, setGasinfo] = useState<Result>();
  const [isDisabled, setIsDisables] = useState(false);
  const [isGasDisabled, setIsGasDisabled] = useState(false);

  const calculateGas = useGasCalculate();
  const { uploadProgram } = useProgramActions();

  const goBack = () => navigate(-1);
  const changeProgramName = (meta: Metadata) => formApi.current?.change('programName', meta?.title ?? '');

  const setFileInputValue = () => {
    const target = fileInputRef.current;

    if (target) {
      const dataTransfer = new DataTransfer();

      dataTransfer.items.add(file);
      target.files = dataTransfer.files;
      target.dispatchEvent(new Event('change', { bubbles: true }));
      // Help Safari out
      if (target.webkitEntries.length) {
        target.dataset.file = `${dataTransfer.files[0].name}`;
      }
    }
  };

  const handleGasCalculate = async () => {
    if (!formApi.current) {
      return;
    }

    setIsGasDisabled(true);

    const { values } = formApi.current.getState();
    const preparedValues = { ...values, payload: getSubmitPayload(values.payload) };

    try {
      const info = await calculateGas(GasMethod.InitUpdate, preparedValues, fileBuffer, metadata);

      formApi.current.change('gasLimit', info.limit);
      setGasinfo(info);
    } finally {
      setIsGasDisabled(false);
    }
  };

  const handleSubmitForm = (values: FormValues) => {
    setIsDisables(true);

    const { value, payload, gasLimit, programName, payloadType } = values;

    const data: Payload = {
      value,
      gasLimit,
      metadata,
      programName,
      metadataBuffer,
      payloadType: metadata ? undefined : payloadType,
      initPayload: metadata ? getSubmitPayload(payload) : payload,
    };

    uploadProgram({
      file,
      payload: data,
      reject: () => setIsDisables(false),
      resolve: () => navigate(routes.programs),
    });
  };

  const encodeType = metadata?.init_input;

  const deposit = api.existentialDeposit.toNumber();
  const maxGasLimit = api.blockGasLimit.toNumber();

  const payloadFormValues = useMemo(() => getPayloadFormValues(metadata?.types, encodeType), [metadata, encodeType]);

  const validation = useMemo(
    () => {
      const schema = getValidationSchema({ type: encodeType, deposit, metadata, maxGasLimit });

      return getValidation(schema);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metadata, encodeType],
  );

  useEffect(() => {
    if (metadata) {
      changeProgramName(metadata);
    }

    setFileInputValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useChangeEffect(() => {
    if (metadata) {
      changeProgramName(metadata);
    } else {
      formApi.current?.restart();
      setGasinfo(undefined);
    }
  }, [metadata]);

  return (
    <Form validateOnBlur initialValues={INITIAL_VALUES} validate={validation} onSubmit={handleSubmitForm}>
      {({ form, handleSubmit }) => {
        formApi.current = form;

        return (
          <form onSubmit={handleSubmit}>
            <Box className={styles.formContent}>
              <FileInput
                ref={fileInputRef}
                label="Program file"
                direction="y"
                onChange={onFileChange}
                className={clsx(formStyles.field, formStyles.gap16)}
              />

              <FormInput name="programName" label="Name" placeholder="Enter program name" direction="y" />

              <FormPayload name="payload" label="Initial payload" values={payloadFormValues} direction="y" />

              {!metadata && <FormPayloadType name="payloadType" label="Initial payload type" />}

              <GasField
                name="gasLimit"
                label="Gas limit"
                placeholder="0"
                disabled={isGasDisabled}
                onGasCalculate={handleGasCalculate}
                direction="y"
              />

              {gasInfo && <GasInfoCard gasInfo={gasInfo} />}

              <FormInput min={0} type="number" name="value" label="Initial value" placeholder="0" />
            </Box>

            <div className={styles.buttons}>
              <Button icon={plusSVG} type="submit" text="Upload Program" disabled={isDisabled} />
              <Button icon={closeSVG} text="Cancel Upload" color="light" onClick={goBack} />
            </div>
          </form>
        );
      }}
    </Form>
  );
};

export { ProgramForm };
