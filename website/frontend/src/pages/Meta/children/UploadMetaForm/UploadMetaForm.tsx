import { useState } from 'react';
import { Formik, Form, FormikProps } from 'formik';
import { Metadata } from '@gear-js/api';
import { useAlert, useAccount } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { Schema } from './Shema';
import { FormValues } from './types';

import { addMetadata } from 'services/ApiService';
import { FormInput, formStyles } from 'components/common/Form';
import { UploadMeta, UploadData } from 'components/blocks/UploadMeta';

type Props = {
  programId: string;
  programName: string;
};

const UploadMetaForm = ({ programId, programName }: Props) => {
  const alert = useAlert();
  const { account } = useAccount();

  const [metadata, setMetadata] = useState<Metadata>();
  const [metadataFile, setMetadataFile] = useState<File>();
  const [metadataBuffer, setMetadataBuffer] = useState<string | null>(null);

  const [initialValues, setInitialValues] = useState<FormValues>({ programName });

  const handleUploadMetaFile = (data: UploadData) => {
    const { meta, metaFile, metaBuffer } = data;

    setMetadata(meta);
    setMetadataFile(metaFile);
    setMetadataBuffer(metaBuffer);
    setInitialValues({
      programName: meta.title ?? programName,
    });
  };

  const handleResetMetaFile = () => {
    setMetadata(undefined);
    setMetadataFile(undefined);
    setMetadataBuffer(null);
    setInitialValues({ programName });
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      if (!account) {
        throw new Error('Wallet not connected');
      }

      if (!metadata) {
        throw new Error('Metadata not loaded');
      }

      await addMetadata(metadata, metadataBuffer, account, programId, values.programName, alert);

      handleResetMetaFile();
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);
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
        const isDisable = !metadata || !isValid || isSubmitting;

        return (
          <Form className={formStyles.largeForm}>
            <FormInput name="programName" label="Program name" />

            <UploadMeta
              meta={metadata}
              metaFile={metadataFile}
              onReset={handleResetMetaFile}
              onUpload={handleUploadMetaFile}
            />

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
