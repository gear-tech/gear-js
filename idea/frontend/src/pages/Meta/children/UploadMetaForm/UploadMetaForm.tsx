import { useState } from 'react';
import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import { Metadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { Schema } from './Shema';
import { FormValues } from './types';

import { useMetadataUpload } from 'hooks';
import { FormInput, formStyles } from 'components/common/Form';
import { UploadMeta, UploadData } from 'components/blocks/UploadMeta';

type Props = {
  programId: string;
  programName: string;
};

const UploadMetaForm = ({ programId, programName }: Props) => {
  const alert = useAlert();

  const uploadMetadata = useMetadataUpload();

  const [metadata, setMetadata] = useState<Metadata>();
  const [metadataBuffer, setMetadataBuffer] = useState<string>();

  const [initialValues, setInitialValues] = useState<FormValues>({ programName });

  const handleUploadMetaFile = (data: UploadData) => {
    const { meta, metaBuffer } = data;

    setMetadata(meta);
    setMetadataBuffer(metaBuffer);
    setInitialValues({
      programName: meta.title ?? programName,
    });
  };

  const handleResetMetaFile = () => {
    setMetadata(undefined);
    setMetadataBuffer(undefined);
    setInitialValues({ programName });
  };

  const handleSubmit = (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    const disableSubmitting = () => helpers.setSubmitting(false);

    if (!metadata || !metadataBuffer) {
      alert.error('Metadata not loaded');
      disableSubmitting();

      return;
    }

    uploadMetadata({
      name: values.programName,
      metadata,
      programId,
      metadataBuffer,
      reject: disableSubmitting,
      resolve: handleResetMetaFile,
    });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={Schema} enableReinitialize onSubmit={handleSubmit}>
      {({ isValid, isSubmitting }: FormikProps<FormValues>) => {
        const isDisable = !metadata || !isValid || isSubmitting;

        return (
          <Form className={formStyles.largeForm}>
            <FormInput name="programName" label="Program name" />

            <UploadMeta meta={metadata} onReset={handleResetMetaFile} onUpload={handleUploadMetaFile} />

            <div className={formStyles.formButtons}>
              <Button type="submit" text="Upload metadata" disabled={isDisable} />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export { UploadMetaForm };
