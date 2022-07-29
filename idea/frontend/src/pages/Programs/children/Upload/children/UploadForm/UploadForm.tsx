import { useState, useMemo } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import clsx from 'clsx';
import { Metadata } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { useApi, useAccount } from '@gear-js/react-hooks';

import styles from './UploadForm.module.scss';
import { INITIAL_VALUES } from './const';
import { getValidationSchema } from './Schema';
import { FormValues, SetFieldValue, SetValues } from './types';
import { FormWrapper } from '../FormWrapper';

import { GasMethod } from 'consts';
import { useProgramUpload, useGasCalculate } from 'hooks';
import { readFileAsync } from 'helpers';
import { getSubmitPayload, getPayloadFormValues } from 'components/common/Form/FormPayload/helpers';
import { UploadProgramModel } from 'types/program';
import { Fieldset } from 'components/common/Fieldset';
import { FormInput, FormPayload, FormPayloadType, FormNumberFormat, formStyles } from 'components/common/Form';
import { UploadMeta, UploadData } from 'components/blocks/UploadMeta';

type Props = {
  droppedFile: File;
  onReset: () => void;
};

const UploadForm = ({ droppedFile, onReset }: Props) => {
  const { api } = useApi();
  const { account } = useAccount();

  const [metadata, setMetadata] = useState<Metadata>();
  const [metadataBuffer, setMetadataBuffer] = useState<string | null>(null);

  const calculateGas = useGasCalculate();
  const uploadProgram = useProgramUpload();

  const handleUploadMetaFile = (setFiledValue: SetFieldValue) => (data: UploadData) => {
    const { meta, metaBuffer } = data;

    setMetadata(meta);
    setMetadataBuffer(metaBuffer);
    setFiledValue('programName', meta?.title || '', false);
  };

  const handleResetMeta = (setValues: SetValues) => () => {
    setMetadata(undefined);
    setMetadataBuffer(null);
    setValues(INITIAL_VALUES);
  };

  const handleSubmitForm = (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    const { value, payload, gasLimit, programName, payloadType } = values;

    const programModel: UploadProgramModel = {
      meta: metadata,
      value,
      title: '',
      gasLimit,
      programName,
      payloadType: metadata ? void 0 : payloadType,
      initPayload: metadata ? getSubmitPayload(payload) : payload,
    };

    uploadProgram({
      file: droppedFile,
      programModel,
      metadataBuffer,
      reject: () => helpers.setSubmitting(false),
      resolve: onReset,
    });
  };

  const handleCalculateGas = async (values: FormValues, setFieldValue: SetFieldValue) => {
    const fileBuffer = (await readFileAsync(droppedFile)) as ArrayBuffer;
    const code = Buffer.from(new Uint8Array(fileBuffer));

    calculateGas(GasMethod.Init, values, code, metadata).then((gasLimit) => setFieldValue('gasLimit', gasLimit));
  };

  const deposit = +api.existentialDeposit.toHuman();
  const encodeType = metadata?.init_input;

  const payloadFormValues = useMemo(() => getPayloadFormValues(metadata?.types, encodeType), [metadata, encodeType]);

  const validationSchema = useMemo(
    () => getValidationSchema(deposit, encodeType, metadata),
    [deposit, metadata, encodeType]
  );

  const isUploadAvailable = !(account && parseInt(account.balance.value, 10) > 0);

  return (
    <FormWrapper header="Uplaod new program">
      <Formik
        initialValues={INITIAL_VALUES}
        validateOnChange={false}
        validationSchema={validationSchema}
        onReset={onReset}
        onSubmit={handleSubmitForm}
      >
        {({ values, isValid, isSubmitting, setValues, setFieldValue }) => {
          const isDisabled = !isValid || isSubmitting;

          return (
            <Form>
              <div className={styles.formContent}>
                <div className={styles.program}>
                  <div className={clsx(formStyles.formItem, styles.file)}>
                    <span className={formStyles.fieldLabel}>File</span>
                    <span className={clsx(formStyles.fieldContent, styles.fileName)}>{droppedFile?.name}</span>
                  </div>

                  <FormInput name="programName" label="Name" placeholder="Name" />

                  <FormNumberFormat
                    name="gasLimit"
                    label="Gas limit"
                    placeholder="1,000,000,000"
                    thousandSeparator
                    allowNegative={false}
                  />

                  <FormInput min={0} type="number" name="value" label="Initial value" placeholder="0" />

                  <FormPayload name="payload" label="Initial payload" values={payloadFormValues} />

                  {!metadata && <FormPayloadType name="payloadType" label="Initial payload type" />}
                </div>

                <Fieldset legend="Metadata:" className={styles.meta}>
                  <UploadMeta
                    meta={metadata}
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
    </FormWrapper>
  );
};

export { UploadForm };
