import { useState } from 'react';
import { useAlert } from 'react-alert';
import { Formik, Form, FormikHelpers, FormikProps } from 'formik';
import { Button } from '@gear-js/ui';
import { getWasmMetadata, Metadata } from '@gear-js/api';

import styles from './UploadMetaForm.module.scss';
import { Schema } from './model/Schema';
import { FormValues } from './model/types';
import { META_FIELDS, INITIAL_VALUES } from './model/const';
import { getMetaValues } from 'components/blocks/UploadMetaForm/helpers/getMetaValues';
import { MetaSwitch } from 'components/common/MetaSwitch';
import { MetaFile } from 'components/common/MetaFile';
import { MetaField } from 'components/common/MetaField';

import { readFileAsync } from 'helpers';
import { useAccount } from 'hooks';
import { addMetadata } from 'services/ApiService';

type Props = {
  programId: string;
  programName: string;
};

const UploadMetaForm = ({ programId, programName }: Props) => {
  const alert = useAlert();
  const { account } = useAccount();

  const [isFileUpload, setFileUpload] = useState(true);

  const [meta, setMeta] = useState<Metadata | null>(null);
  const [metaFile, setMetaFile] = useState<File | null>(null);
  const [metaBuffer, setMetaBuffer] = useState<string | null>(null);
  const [fieldsFromFile, setFieldFromFile] = useState<string[] | null>(null);
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

      setMeta(currentMetaWasm);
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
    setMeta(null);
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
      if (meta) {
        addMetadata(meta, metaBuffer, account, programId, name, alert);
      } else {
        alert.error(`ERROR: metadata not loaded`);
      }
    } else {
      addMetadata(formMeta, null, account, programId, name, alert);
    }

    actions.setSubmitting(false);
    resetForm();
  };

  const fields = isFileUpload ? fieldsFromFile : META_FIELDS;

  return (
    <Formik
      initialValues={initialValues}
      validateOnBlur
      validationSchema={Schema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isValid, isSubmitting }: FormikProps<FormValues>) => {
        const emptyFile = isFileUpload && !meta;
        const disabledBtn = emptyFile || !isValid || isSubmitting;

        return (
          <Form className={styles.uploadMetaForm}>
            <MetaSwitch isMetaFromFile={isFileUpload} onChange={setFileUpload} className={styles.formField} />
            <MetaField name="name" label="Program name:" className={styles.formField} />
            {fields?.map((field) => (
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

export { UploadMetaForm };
