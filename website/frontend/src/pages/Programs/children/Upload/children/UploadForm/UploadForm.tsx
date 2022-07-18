import { Dispatch, SetStateAction, useState, useMemo } from 'react';
import { Formik, Form } from 'formik';
import clsx from 'clsx';
import { Metadata } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { useApi, useAlert, useAccount } from '@gear-js/react-hooks';

import styles from './UploadForm.module.scss';
import { INITIAL_VALUES } from './const';
import { getValidationSchema } from './Schema';
import { FormValues, SetFieldValue, SetValues } from './types';
import { DroppedFile } from '../../types';

import { Box } from 'layout/Box/Box';
import { UploadProgramModel } from 'types/program';
import { useProgramUpload } from 'hooks';
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
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();

  const [metadata, setMetadata] = useState<Metadata>();
  const [metadataFile, setMetadataFile] = useState<File>();
  const [metadataBuffer, setMetadataBuffer] = useState<string | null>(null);

  const uploadProgram = useProgramUpload();

  const handleUploadMetaFile = (setFiledValue: SetFieldValue) => (data: UploadData) => {
    const { meta, metaFile, metaBuffer } = data;

    setMetadata(meta);
    setMetadataFile(metaFile);
    setMetadataBuffer(metaBuffer);
    setFiledValue('programName', meta?.title || '', false);
  };

  const handleResetMeta = (setValues: SetValues) => () => {
    setMetadata(undefined);
    setMetadataFile(undefined);
    setMetadataBuffer(null);
    setValues(INITIAL_VALUES);
  };

  const handleResetForm = () => setDroppedFile(null);

  const handleSubmitForm = (values: FormValues) => {
    const { value, payload, gasLimit, programName, payloadType } = values;

    const programOptions: UploadProgramModel = {
      meta: metadata,
      value,
      title: '',
      gasLimit,
      programName,
      payloadType: metadata ? void 0 : payloadType,
      initPayload: metadata ? getSubmitPayload(payload) : payload,
    };

    uploadProgram(droppedFile, programOptions, metadataBuffer, handleResetForm);
  };

  const handleCalculateGas = async (values: FormValues, setFieldValue: SetFieldValue) => {
    const fileBuffer = (await readFileAsync(droppedFile)) as ArrayBuffer;
    const code = Buffer.from(new Uint8Array(fileBuffer));

    calculateGas('init', api, values, alert, metadata, code).then((gasLimit) => setFieldValue('gasLimit', gasLimit));
  };

  const encodeType = metadata?.init_input;

  const payloadFormValues = useMemo(() => getPayloadFormValues(metadata?.types, encodeType), [metadata, encodeType]);

  const validationSchema = useMemo(() => getValidationSchema(encodeType, metadata), [metadata, encodeType]);

  const isUploadAvailable = !(account && parseInt(account.balance.value, 10) > 0);

  return (
    <Box className={styles.uploadFormWrapper}>
      <h3 className={styles.heading}>UPLOAD NEW PROGRAM</h3>
      <Formik
        initialValues={INITIAL_VALUES}
        validateOnChange={false}
        validationSchema={validationSchema}
        onReset={handleResetForm}
        onSubmit={handleSubmitForm}
      >
        {({ values, isValid, isSubmitting, setValues, setFieldValue }) => {
          const isDisabled = !isValid || isSubmitting;

          return (
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
                    placeholder="1,000,000,000"
                    thousandSeparator
                    allowNegative={false}
                  />

                  <FormInput type="number" name="value" label="Initial value" placeholder="0" />

                  <FormPayload name="payload" label="Initial payload" values={payloadFormValues} />

                  {!metadata && <FormPayloadType name="payloadType" label="Initial payload type" />}
                </div>

                <Fieldset legend="Metadata:" className={styles.meta}>
                  <UploadMeta
                    meta={metadata}
                    metaFile={metadataFile}
                    onReset={handleResetMeta(setValues)}
                    onUpload={handleUploadMetaFile(setFieldValue)}
                  />
                </Fieldset>
              </div>

              <div className={styles.buttons}>
                <Button type="submit" text="Upload program" disabled={isDisabled || isUploadAvailable} />
                <Button
                  text="Calculate Gas"
                  onClick={() => {
                    handleCalculateGas(values, setFieldValue);
                  }}
                  disabled={isDisabled}
                />
                <Button type="reset" text="Cancel upload" color="transparent" />
              </div>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export { UploadForm };
