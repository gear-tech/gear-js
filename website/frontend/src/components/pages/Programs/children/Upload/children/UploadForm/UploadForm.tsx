import { ChangeEvent, Dispatch, SetStateAction, useState, VFC, useMemo } from 'react';
import { Formik, Form } from 'formik';
import clsx from 'clsx';
import { Metadata, getWasmMetadata } from '@gear-js/api';
import { Button, FileInput } from '@gear-js/ui';

import styles from './UploadForm.module.scss';
import { Schema } from './Schema';
import { INITIAL_VALUES } from './const';
import { FormValues, ProgramValues, SetFieldValue, SetValues } from './types';
import { DroppedFile } from '../../types';

import { Box } from 'layout/Box/Box';
import { UploadProgramModel } from 'types/program';
import { UploadProgram } from 'services/ApiService';
import { useAccount, useApi, useAlert } from 'hooks';
import { readFileAsync, calculateGas, checkFileFormat } from 'helpers';
import { getSubmitPayload, getPayloadFormValues } from 'components/common/FormPayload/helpers';
import { MetaSwitch } from 'components/common/MetaSwitch';
import { META_FIELDS } from 'components/blocks/UploadMetaForm/model/const';
import { FormInput, FormTextarea, FormNumberFormat } from 'components/common/FormFields';
import { FormPayload } from 'components/common/FormPayload';
import { getMetaValues } from 'components/blocks/UploadMetaForm/helpers/getMetaValues';

type Props = {
  setDroppedFile: Dispatch<SetStateAction<DroppedFile | null>>;
  droppedFile: File;
};

export const UploadForm: VFC<Props> = ({ setDroppedFile, droppedFile }) => {
  const { api } = useApi();
  const alert = useAlert();
  const { account } = useAccount();

  const [fieldFromFile, setFieldFromFile] = useState<string[] | null>(null);
  const [meta, setMeta] = useState<Metadata | null>(null);
  const [metaFile, setMetaFile] = useState<string | null>(null);
  const [droppedMetaFile, setDroppedMetaFile] = useState<File>();
  const [isMetaFromFile, setIsMetaFromFile] = useState<boolean>(true);

  const handleResetForm = () => {
    setDroppedFile(null);
  };

  const handleResetMetaForm = (setValues: SetValues) => {
    setMeta(null);
    setMetaFile(null);
    setDroppedMetaFile(void 0);
    setFieldFromFile(null);
    setValues(INITIAL_VALUES, false);
  };

  const handleUploadMetaFile = (setValues: SetValues) => async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return handleResetMetaForm(setValues);
    }

    try {
      if (!checkFileFormat(file)) {
        throw new Error('Wrong file format');
      }

      setDroppedMetaFile(file);

      const readedFile = (await readFileAsync(file)) as Buffer;
      const metadata: Metadata = await getWasmMetadata(readedFile);

      if (!metadata) {
        throw new Error('Failed to load metadata');
      }

      const metaBufferString = Buffer.from(new Uint8Array(readedFile)).toString('base64');
      const valuesFromFile = getMetaValues(metadata);

      setMeta(metadata);
      setMetaFile(metaBufferString);
      setFieldFromFile(Object.keys(valuesFromFile));
      setValues(
        ({ programValues }) => ({
          metaValues: valuesFromFile,
          programValues: {
            ...programValues,
            programName: metadata?.title || '',
          },
        }),
        false
      );
    } catch (error) {
      alert.error(`${error}`);
    }
  };

  const handleSubmitForm = (values: FormValues) => {
    if (!account) {
      alert.error(`Wallet not connected`);
      return;
    }

    const { value, payload, gasLimit, programName } = values.programValues;

    const programOptions: UploadProgramModel = {
      meta: void 0,
      value,
      title: '',
      gasLimit,
      programName,
      initPayload: meta ? getSubmitPayload(payload) : payload,
    };

    if (meta) {
      programOptions.meta = isMetaFromFile ? meta : values.metaValues;
    }

    UploadProgram(api, account, droppedFile, programOptions, metaFile, alert, handleResetForm).catch(() => {
      alert.error(`Invalid JSON format`);
    });
  };

  const handleCalculateGas = async (values: ProgramValues, setFieldValue: SetFieldValue) => {
    const fileBuffer = (await readFileAsync(droppedFile)) as ArrayBuffer;
    const code = Buffer.from(new Uint8Array(fileBuffer));

    calculateGas('init', api, values, alert, meta, code).then((gasLimit) =>
      setFieldValue('programValues.gasLimit', gasLimit)
    );
  };

  const payloadFormValues = useMemo(() => getPayloadFormValues(meta?.types, meta?.init_input), [meta]);

  const metaFields = isMetaFromFile ? fieldFromFile : META_FIELDS;
  const isUploadAvailable = !(account && parseInt(account.balance.value, 10) > 0);

  return (
    <Box className={styles.uploadFormWrapper}>
      <h3 className={styles.heading}>UPLOAD NEW PROGRAM</h3>
      <Formik initialValues={INITIAL_VALUES} validateOnBlur validationSchema={Schema} onSubmit={handleSubmitForm}>
        {({ values, setFieldValue, setValues }) => (
          <Form className={styles.uploadForm}>
            <div className={styles.formContent}>
              <div className={styles.program}>
                <div className={styles.fieldWrapper}>
                  <span className={styles.caption}>File:</span>
                  <span className={styles.fileName}>{droppedFile.name}</span>
                </div>
                <FormInput
                  name="programValues.programName"
                  label="Name:"
                  placeholder="Name"
                  className={styles.formField}
                />
                <FormNumberFormat
                  name="programValues.gasLimit"
                  label="Gas limit:"
                  placeholder="20,000,000"
                  thousandSeparator
                  allowNegative={false}
                  className={styles.formField}
                />
                <FormInput
                  type="number"
                  name="programValues.value"
                  label="Initial value:"
                  placeholder="0"
                  className={styles.formField}
                />
                <div className={styles.fieldWrapper}>
                  <label htmlFor="programValues.payload" className={clsx(styles.caption, styles.top)}>
                    Initial payload:
                  </label>
                  <FormPayload name="programValues.payload" values={payloadFormValues} />
                </div>
              </div>

              <fieldset className={styles.meta}>
                <legend className={styles.metaLegend}>Metadata:</legend>
                <MetaSwitch isMetaFromFile={isMetaFromFile} onChange={setIsMetaFromFile} className={styles.formField} />
                {isMetaFromFile && (
                  <div className={styles.fieldWrapper}>
                    <FileInput
                      label="Metadata file:"
                      value={droppedMetaFile}
                      className={clsx(styles.formField, styles.fileInput)}
                      onChange={handleUploadMetaFile(setValues)}
                    />
                  </div>
                )}
                {metaFields?.map((field) => {
                  const FormField = field === 'types' ? FormTextarea : FormInput;

                  return (
                    <FormField
                      key={field}
                      name={`metaValues.${field}`}
                      label={`${field}:`}
                      disabled={isMetaFromFile}
                      className={styles.formField}
                    />
                  );
                })}
              </fieldset>
            </div>

            <div className={styles.buttons}>
              <Button type="submit" text="Upload program" disabled={isUploadAvailable} />
              <Button
                text="Calculate Gas"
                onClick={() => {
                  handleCalculateGas(values.programValues, setFieldValue);
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
