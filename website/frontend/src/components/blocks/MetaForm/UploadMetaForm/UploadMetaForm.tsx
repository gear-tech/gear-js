import { useState } from 'react';
import { useAlert } from 'react-alert';
import { Formik, Form, FormikHelpers, FormikProps } from 'formik';
import { Button } from '@gear-js/ui';
import { getWasmMetadata, Metadata } from '@gear-js/api';

import styles from './UploadMetaForm.module.scss';
import { FormValues } from './types';
import { Schema } from './Schema';
import { META_FIELDS, INITIAL_VALUES } from '../const';
import { getMetaValues } from '../lib/getMetaValues';
import { MetaSwitch } from '../children/MetaSwitch/MetaSwitch';
import { MetaFile } from '../children/MetaFile/MetaFile';
import { MetaField } from '../children/MetaField/MetaField';

import { readFileAsync } from 'helpers';
import { useAccount } from 'hooks';
import { addMetadata } from 'services/ApiService';

type Props = {
  programId: string;
  programName: string;
};

export const UploadMetaForm = ({ programId, programName }: Props) => {
  const alert = useAlert();
  const { account } = useAccount();

  const [isFileUpload, setFileUpload] = useState(true);

  const [metaFile, setMetaFile] = useState<File | null>(null);
  const [metaWasm, setMetaWasm] = useState<Metadata | null>(null);
  const [metaBuffer, setMetaBuffer] = useState<string | null>(null);
  const [fieldFromFile, setFieldFromFile] = useState<string[] | null>(null);
  const [initialValues, setInitialValues] = useState<FormValues>({
    name: programName,
    ...INITIAL_VALUES,
  });

  const handleUploadMetaFile = async (file: File) => {
    try {
      const fileBuffer = (await readFileAsync(file)) as Buffer;
      const currentMetaWasm = await getWasmMetadata(fileBuffer);

      if (!currentMetaWasm) {
        return;
      }

      const valuesFromFile = getMetaValues(currentMetaWasm);
      const currentMetaBuffer = Buffer.from(new Uint8Array(fileBuffer)).toString('base64');

      setMetaWasm(currentMetaWasm);
      setMetaBuffer(currentMetaBuffer);
      setFieldFromFile(Object.keys(valuesFromFile));
      setInitialValues({
        ...INITIAL_VALUES,
        ...valuesFromFile,
        name: currentMetaWasm.title ?? programName,
      });
    } catch (error) {
      alert.error(`${error}`);
    } finally {
      setMetaFile(file);
    }
  };

  const resetForm = () => {
    setMetaFile(null);
    setMetaWasm(null);
    setMetaBuffer(null);
    setFieldFromFile(null);
    setInitialValues({
      name: programName,
      ...INITIAL_VALUES,
    });
  };

  const handleSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    if (!account) {
      alert.error(`WALLET NOT CONNECTED`);
      return;
    }

    const { name, ...formMeta } = values;

    if (isFileUpload) {
      if (metaWasm) {
        addMetadata(metaWasm, metaBuffer, account, programId, name, alert);
      } else {
        alert.error(`ERROR: metadata not loaded`);
      }
    } else {
      addMetadata(formMeta, null, account, programId, name, alert);
    }

    actions.setSubmitting(false);
    resetForm();
  };

  const showingFields = isFileUpload ? fieldFromFile : META_FIELDS;

  return (
    <Formik
      initialValues={initialValues}
      validateOnBlur
      validationSchema={Schema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isValid, isSubmitting }: FormikProps<FormValues>) => {
        const emptyFile = isFileUpload && !metaWasm;
        const disabledBtn = emptyFile || !isValid || isSubmitting;

        return (
          <Form className={styles.uploadMetaForm}>
            <MetaSwitch isMetaFromFile={isFileUpload} onChange={setFileUpload} className={styles.formField} />
            <MetaField name="name" label="Program name:" className={styles.formField} />
            {showingFields?.map((field) => (
              <MetaField
                key={field}
                name={field}
                label={`${field}:`}
                fieldAs={field === 'types' ? 'textarea' : 'input'}
                disabled={isFileUpload}
                className={styles.formField}
              />
            ))}
            {isFileUpload && (
              <MetaFile
                file={metaFile}
                className={styles.formField}
                onUpload={handleUploadMetaFile}
                onDelete={resetForm}
              />
            )}
            <div className={styles.formBtnWrapper}>
              <Button type="submit" text="Upload metadata" className={styles.formSubmitBtn} disabled={disabledBtn} />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
