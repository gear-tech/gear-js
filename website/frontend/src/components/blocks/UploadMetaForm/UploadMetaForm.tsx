import { useState } from 'react';
import { Formik, Form, FormikHelpers, FormikProps } from 'formik';
import { Button } from '@gear-js/ui';
import { Metadata } from '@gear-js/api';

import styles from './UploadMetaForm.module.scss';
import { Schema } from './Shema';
import { FormValues } from './types';
import { FormInput } from 'components/common/Form';
import { UploadMeta, UploadData } from 'components/blocks/UploadMeta';
import { formStyles } from 'components/common/Form';

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
  const [initialValues, setInitialValues] = useState<FormValues>({
    name: programName,
  });

  const handleUploadMetaFile = (data: UploadData) => {
    setMeta(data.meta);
    setMetaBuffer(data.metaBufferString);
    setInitialValues({
      name: data.meta.title ?? programName,
    });
  };

  const resetForm = () => {
    setMeta(null);
    setMetaBuffer(null);
    setInitialValues({
      name: programName,
    });
  };

  const handleSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    if (!account) {
      alert.error(`WALLET NOT CONNECTED`);
      return;
    }

    if (!meta) {
      alert.error(`ERROR: metadata not loaded`);
      return;
    }

    addMetadata(meta, metaBuffer, account, programId, values.name, alert);

    actions.setSubmitting(false);
    resetForm();
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
          <Form className={styles.uploadMetaForm}>
            <FormInput name="name" label="Program name" className={styles.formField} />

            <UploadMeta onReset={resetForm} onUpload={handleUploadMetaFile} />

            <div className={styles.formBtnWrapper}>
              <Button type="submit" text="Upload metadata" className={styles.formSubmitBtn} disabled={disabledBtn} />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export { UploadMetaForm };
