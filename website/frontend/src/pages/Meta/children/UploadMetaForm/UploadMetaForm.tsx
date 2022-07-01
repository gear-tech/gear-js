import { useState } from 'react';
import { Formik, Form, FormikHelpers, FormikProps } from 'formik';
import { Button } from '@gear-js/ui';
import { Metadata } from '@gear-js/api';

import { Schema } from './Shema';
import { FormValues } from './types';
import { FormInput, formStyles } from 'components/common/Form';
import { UploadMeta, UploadData } from 'components/blocks/UploadMeta';

import { useAccount, useAlert } from 'hooks';
import { addMetadata } from 'services/ApiService';

type Props = {
  programId: string;
  programName: string;
};

const UploadMetaForm = ({ programId, programName }: Props) => {
  const alert = useAlert();
  const { account } = useAccount();

  const [meta, setMeta] = useState<Metadata | null>(null);
  const [metaBuffer, setMetaBuffer] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<FormValues>({ programName });

  const handleUploadMetaFile = (data: UploadData) => {
    setMeta(data.meta);
    setMetaBuffer(data.metaBufferString);
    setInitialValues({
      programName: data.meta.title ?? programName,
    });
  };

  const resetForm = () => {
    setMeta(null);
    setMetaBuffer(null);
    setInitialValues({ programName });
  };

  const handleSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    try {
      if (!account) {
        throw new Error('Wallet not connected');
      }

      if (!meta) {
        throw new Error('Metadata not loaded');
      }

      addMetadata(meta, metaBuffer, account, programId, values.programName, alert);
      resetForm();
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validateOnBlur
      validationSchema={Schema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isValid, isSubmitting }: FormikProps<FormValues>) => {
        const disabledBtn = !meta || !isValid || isSubmitting;

        return (
          <Form className={formStyles.largeForm}>
            <FormInput name="programName" label="Program name" />

            <UploadMeta onReset={resetForm} onUpload={handleUploadMetaFile} />

            <div className={formStyles.formButtons}>
              <Button type="submit" text="Upload metadata" disabled={disabledBtn} />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export { UploadMetaForm };
