import { useState, useMemo, ReactNode } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import clsx from 'clsx';
import { Metadata } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';

import styles from './ProgramForm.module.scss';
import { INITIAL_VALUES } from './const';
import { getValidationSchema } from './Schema';
import { FormValues, PropsToRenderButtons, SetFieldValue, Helpers } from './types';

import { Payload } from 'hooks/useProgramActions/types';
import { getSubmitPayload, getPayloadFormValues } from 'components/common/Form/FormPayload/helpers';
import { Fieldset } from 'components/common/Fieldset';
import { FormInput, FormPayload, FormPayloadType, FormNumberFormat, formStyles } from 'components/common/Form';
import { UploadMeta, UploadData } from 'components/blocks/UploadMeta';

type Props = {
  name: string;
  label: string;
  onSubmit: (payload: Payload, helpers: Helpers) => Promise<void> | void;
  onReset?: () => void;
  renderButtons: (props: PropsToRenderButtons) => ReactNode;
};

const ProgramForm = ({ name, label, onSubmit, onReset, renderButtons }: Props) => {
  const { api } = useApi();

  const [metadata, setMetadata] = useState<Metadata>();
  const [metadataBuffer, setMetadataBuffer] = useState<string>();

  const handleUploadMetaFile = (setFiledValue: SetFieldValue) => (data: UploadData) => {
    const { meta, metaBuffer } = data;

    setMetadata(meta);
    setMetadataBuffer(metaBuffer);
    setFiledValue('programName', meta?.title || '', false);
  };

  const handleResetMeta = (resetForm: () => void) => () => {
    setMetadata(undefined);
    setMetadataBuffer(undefined);
    resetForm();
  };

  const handleSubmitForm = (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    const { value, payload, gasLimit, programName, payloadType } = values;

    const finishSubmitting = () => helpers.setSubmitting(false);

    const data: Payload = {
      value,
      gasLimit,
      metadata,
      programName,
      metadataBuffer,
      payloadType: metadata ? void 0 : payloadType,
      initPayload: metadata ? getSubmitPayload(payload) : payload,
    };

    onSubmit(data, { resetForm: handleResetMeta(helpers.resetForm), finishSubmitting });
  };

  const encodeType = metadata?.init_input;

  const deposit = api.existentialDeposit.toNumber();
  const maxGasLimit = api.blockGasLimit.toNumber();

  const payloadFormValues = useMemo(() => getPayloadFormValues(metadata?.types, encodeType), [metadata, encodeType]);

  const validationSchema = useMemo(
    () => getValidationSchema({ type: encodeType, deposit, metadata, maxGasLimit }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metadata, encodeType]
  );

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validateOnChange={false}
      validationSchema={validationSchema}
      onSubmit={handleSubmitForm}
      onReset={onReset}
    >
      {({ values, isValid, isSubmitting, resetForm, setFieldValue }) => {
        const isDisabled = !isValid || isSubmitting;

        return (
          <Form>
            <div className={styles.formContent}>
              <div className={styles.program}>
                <div className={clsx(formStyles.formItem, styles.file)}>
                  <span className={formStyles.fieldLabel}>{label}</span>
                  <span className={clsx(formStyles.fieldContent, styles.fileName)}>{name}</span>
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
                  onReset={handleResetMeta(resetForm)}
                  onUpload={handleUploadMetaFile(setFieldValue)}
                />
              </Fieldset>
            </div>

            <div className={styles.buttons}>{renderButtons({ isDisabled, values, setFieldValue, metadata })}</div>
          </Form>
        );
      }}
    </Formik>
  );
};

export { ProgramForm };
