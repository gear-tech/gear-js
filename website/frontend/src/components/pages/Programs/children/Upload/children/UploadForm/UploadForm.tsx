import { Dispatch, SetStateAction, useState, useMemo } from 'react';
import { Formik, Form } from 'formik';
import clsx from 'clsx';
import { Metadata } from '@gear-js/api';
import { Button } from '@gear-js/ui';

import styles from './UploadForm.module.scss';
import { Schema } from './Schema';
import { INITIAL_VALUES } from './const';
import { FormValues, SetFieldValue, SetValues } from './types';
import { DroppedFile } from '../../types';

import { Box } from 'layout/Box/Box';
import { UploadProgramModel } from 'types/program';
import { UploadProgram } from 'services/ApiService';
import { useAccount, useApi, useAlert } from 'hooks';
import { readFileAsync, calculateGas } from 'helpers';
import { getSubmitPayload, getPayloadFormValues } from 'components/common/Form/FormPayload/helpers';
import { Fieldset } from 'components/common/Fieldset';
import { FormInput, FormPayload, FormPayloadType, FormNumberFormat, formStyles } from 'components/common/Form';
import { UploadMeta, UploadData } from 'components/blocks/UploadMeta';

type Props = {
  setDroppedFile: Dispatch<SetStateAction<DroppedFile | null>>;
  droppedFile: File;
};

const UploadForm = ({ setDroppedFile, droppedFile }: Props) => {
  const { api } = useApi();
  const alert = useAlert();
  const { account } = useAccount();

  const [meta, setMeta] = useState<Metadata>();
  const [metaFile, setMetaFile] = useState<string | null>(null);

  const handleUploadMetaFile = (setFiledValue: SetFieldValue) => (data: UploadData) => {
    const metadata = data.meta;

    setMeta(metadata);
    setMetaFile(data.metaBufferString);
    setFiledValue('programName', metadata?.title || '', false);
  };

  const handleResetMeta = (setValues: SetValues) => () => {
    setMeta(void 0);
    setMetaFile(null);
    setValues(INITIAL_VALUES, false);
  };

  const handleResetForm = () => {
    setDroppedFile(null);
  };

  const handleSubmitForm = (values: FormValues) => {
    if (!account) {
      alert.error(`Wallet not connected`);
      return;
    }

    const { value, payload, gasLimit, programName, payloadType } = values;

    const programOptions: UploadProgramModel = {
      meta,
      value,
      title: '',
      gasLimit,
      programName,
      payloadType: meta ? void 0 : payloadType,
      initPayload: meta ? getSubmitPayload(payload) : payload,
    };

    UploadProgram(api, account, droppedFile, programOptions, metaFile, alert, handleResetForm).catch(() => {
      alert.error(`Invalid JSON format`);
    });
  };

  const handleCalculateGas = async (values: FormValues, setFieldValue: SetFieldValue) => {
    const fileBuffer = (await readFileAsync(droppedFile)) as ArrayBuffer;
    const code = Buffer.from(new Uint8Array(fileBuffer));

    calculateGas('init', api, values, alert, meta, code).then((gasLimit) => setFieldValue('gasLimit', gasLimit));
  };

  const payloadFormValues = useMemo(() => getPayloadFormValues(meta?.types, meta?.init_input), [meta]);

  const isUploadAvailable = !(account && parseInt(account.balance.value, 10) > 0);

  return (
    <Box className={styles.uploadFormWrapper}>
      <h3 className={styles.heading}>UPLOAD NEW PROGRAM</h3>
      <Formik initialValues={INITIAL_VALUES} validateOnBlur validationSchema={Schema} onSubmit={handleSubmitForm}>
        {({ values, setFieldValue, setValues }) => (
          <Form className={styles.uploadForm}>
            <div className={styles.formContent}>
              <div className={styles.program}>
                <div className={clsx(formStyles.formItem, styles.file)}>
                  <span className={formStyles.fieldLabel}>File</span>
                  <span className={clsx(formStyles.fieldContent, styles.fileName)}>{droppedFile.name}</span>
                </div>

                <FormInput name="programName" label="Name" placeholder="Name" />

                <FormNumberFormat
                  name="gasLimit"
                  label="Gas limit"
                  placeholder="20,000,000"
                  thousandSeparator
                  allowNegative={false}
                />

                <FormInput type="number" name="value" label="Initial value" placeholder="0" />

                <FormPayload name="payload" label="Initial payload" values={payloadFormValues} />

                {!meta && <FormPayloadType name="payloadType" label="Initial payload type" />}
              </div>

              <Fieldset legend="Metadata:" className={styles.meta}>
                <UploadMeta onReset={handleResetMeta(setValues)} onUpload={handleUploadMetaFile(setFieldValue)} />
              </Fieldset>
            </div>

            <div className={styles.buttons}>
              <Button type="submit" text="Upload program" disabled={isUploadAvailable} />
              <Button
                text="Calculate Gas"
                onClick={() => {
                  handleCalculateGas(values, setFieldValue);
                }}
              />
              <Button
                type="submit"
                text="Cancel upload"
                color="transparent"
                aria-label="closeUploadForm"
                onClick={handleResetForm}
              />
            </div>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export { UploadForm };
