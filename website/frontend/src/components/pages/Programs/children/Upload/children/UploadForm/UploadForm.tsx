import { Dispatch, SetStateAction, useState, VFC } from 'react';
import { useAlert } from 'react-alert';
import clsx from 'clsx';
import { Trash2 } from 'react-feather';
import NumberFormat from 'react-number-format';
import { Metadata, getWasmMetadata, createPayloadTypeStructure, decodeHexTypes } from '@gear-js/api';
import { Checkbox } from '@gear-js/ui';
import { Formik, Form, Field } from 'formik';
import { FormValues } from './types';
import { INITIAL_VALUES } from './const';
import { SetFieldValue } from 'types/common';
import { MetaFieldsStruct, parseMeta, prepareToSend, MetaFields as MetaForm } from 'components/MetaFields';

import styles from './UploadForm.module.scss';
import { Schema } from './Schema';
import { Buttons } from './children/Buttons/Buttons';
import { DroppedFile } from '../../types';
import { META_FIELDS } from 'components/blocks/UploadMetaForm/model/const';
import { getMetaValues } from 'components/blocks/UploadMetaForm/helpers/getMetaValues';
import { MetaSwitch } from 'components/common/MetaSwitch';
import { MetaFile } from 'components/common/MetaFile';
import { MetaField } from 'components/common/MetaField';

import { UploadProgram } from 'services/ApiService';
import { useAccount, useApi, useLoading } from 'hooks';
import { readFileAsync, getPreformattedText, calculateGas } from 'helpers';
import { UploadProgramModel } from 'types/program';

type Props = {
  setDroppedFile: Dispatch<SetStateAction<DroppedFile | null>>;
  droppedFile: File;
};

export const UploadForm: VFC<Props> = ({ setDroppedFile, droppedFile }) => {
  const { api } = useApi();
  const alert = useAlert();
  const { account: currentAccount } = useAccount();
  const { enableLoading, disableLoading } = useLoading();

  const [fieldFromFile, setFieldFromFile] = useState<string[] | null>(null);
  const [meta, setMeta] = useState<Metadata | null>(null);
  const [metaFile, setMetaFile] = useState<string | null>(null);
  const [droppedMetaFile, setDroppedMetaFile] = useState<File | null>(null);
  const [payloadForm, setPayloadForm] = useState<MetaFieldsStruct | null>();
  const [isMetaFromFile, setIsMetaFromFile] = useState<boolean>(true);
  const [isManualPayload, setIsManualPayload] = useState<boolean>(true);
  const [initialValues, setInitialValues] = useState<FormValues>(INITIAL_VALUES);

  const handleUploadMetaFile = async (file: File) => {
    try {
      const fileBuffer = (await readFileAsync(file)) as Buffer;
      const metadata: Metadata = await getWasmMetadata(fileBuffer);

      if (!metadata) {
        return;
      }

      const currentMetaBuffer = Buffer.from(new Uint8Array(fileBuffer)).toString('base64');

      const decodedTypes = decodeHexTypes(metadata?.types || '');
      const typeStructure = createPayloadTypeStructure(metadata?.init_input || '', decodedTypes, true);
      const parsedStructure = parseMeta(typeStructure);

      const valuesFromFile = getMetaValues(metadata);

      setMeta(metadata);
      setMetaFile(currentMetaBuffer);
      setPayloadForm(parsedStructure);
      setFieldFromFile(Object.keys(valuesFromFile));
      setInitialValues((prevState) => ({
        ...prevState,
        ...valuesFromFile,
        programName: metadata.title || '',
        payload: getPreformattedText(typeStructure),
      }));
    } catch (error) {
      alert.error(`${error}`);
    } finally {
      setDroppedMetaFile(file);
    }
  };

  const resetMetaForm = () => {
    setMeta(null);
    setMetaFile(null);
    setPayloadForm(null);
    setDroppedMetaFile(null);
    setFieldFromFile(null);

    setInitialValues(INITIAL_VALUES);
  };
  //TODO: We need to rewrite the form, urgently!
  const handleSubmitForm = (values: any) => {
    if (!currentAccount) {
      alert.error(`Wallet not connected`);
      return;
    }

    const { value, title, gasLimit, payload, programName, initPayload, __root: root, ...other } = values;

    const programOptions: UploadProgramModel = {
      meta: void 0,
      value,
      title,
      gasLimit,
      programName,
      initPayload,
    };

    if (meta) {
      programOptions.meta = isMetaFromFile ? meta : other;
      //@ts-ignore
      programOptions.initPayload = isManualPayload ? payload : prepareToSend(values.__root);
    }

    UploadProgram(
      api,
      currentAccount,
      droppedFile,
      programOptions,
      metaFile,
      enableLoading,
      disableLoading,
      alert,
      () => {
        setDroppedFile(null);
      }
    ).catch(() => {
      alert.error(`Invalid JSON format`);
    });
  };

  const handleResetForm = () => {
    setDroppedFile(null);
    setDroppedMetaFile(null);
  };

  const handleCalculateGas = async (values: FormValues, setFieldValue: SetFieldValue) => {
    const fileBuffer = (await readFileAsync(droppedFile)) as ArrayBuffer;
    const code = Buffer.from(new Uint8Array(fileBuffer));

    calculateGas('init', api, isManualPayload, values, setFieldValue, alert, meta, code);
  };

  const metaFields = isMetaFromFile ? fieldFromFile : META_FIELDS;

  const isShowPayloadForm = payloadForm && !isManualPayload;

  return (
    <div className={styles.uploadForm}>
      <h3 className={styles.heading}>UPLOAD NEW PROGRAM</h3>

      <Formik
        initialValues={initialValues}
        validationSchema={Schema}
        validateOnBlur
        enableReinitialize
        onSubmit={handleSubmitForm}
      >
        {({ errors, touched, values, setFieldValue }) => {
          return (
            <Form>
              <div className={styles.columnsWrapper}>
                <div className={styles.columns}>
                  <div className={styles.columnLeft}>
                    <div className={styles.block}>
                      <span className={styles.caption}>File:</span>
                      <div className={clsx(styles.value, styles.filename)}>
                        {droppedFile.name}
                        <button type="button" onClick={handleResetForm}>
                          <Trash2 color="#ffffff" size="20" strokeWidth="1" />
                        </button>
                      </div>
                    </div>
                    <div className={styles.block}>
                      <label htmlFor="value" className={styles.caption}>
                        Name:
                      </label>
                      <div className={styles.value}>
                        <Field
                          id="programName"
                          name="programName"
                          placeholder="Name"
                          className={styles.field}
                          type="text"
                        />
                        {errors.programName && touched.programName ? (
                          <div className={styles.error}>{errors.programName}</div>
                        ) : null}
                      </div>
                    </div>
                    <div className={styles.block}>
                      <label htmlFor="gasLimit" className={styles.caption}>
                        Gas limit:
                      </label>
                      <div className={styles.value}>
                        <NumberFormat
                          name="gasLimit"
                          placeholder="20,000,000"
                          value={values.gasLimit}
                          thousandSeparator
                          allowNegative={false}
                          className={styles.field}
                          onValueChange={(val) => {
                            const { floatValue } = val;
                            setFieldValue('gasLimit', floatValue);
                          }}
                        />
                        {errors.gasLimit && touched.gasLimit ? (
                          <div className={styles.error}>{errors.gasLimit}</div>
                        ) : null}
                      </div>
                    </div>
                    <div className={styles.block}>
                      <label htmlFor="value" className={styles.caption}>
                        Initial value:
                      </label>
                      <div className={styles.value}>
                        <Field id="value" name="value" placeholder="0" className={styles.field} type="number" />
                        {errors.value && touched.value ? <div className={styles.error}>{errors.value}</div> : null}
                      </div>
                    </div>
                    <div className={styles.block}>
                      <label htmlFor="payload" className={clsx(styles.caption, styles.top)}>
                        Initial payload:
                      </label>
                      <div className={clsx(styles.value, styles.payload)}>
                        {payloadForm && (
                          <div className={styles.switch}>
                            <Checkbox
                              type="switch"
                              onChange={() => setIsManualPayload(!isManualPayload)}
                              label="Manual input"
                              checked={isManualPayload}
                            />
                          </div>
                        )}
                        {isShowPayloadForm ? (
                          <div className="message-form--info">
                            <MetaForm data={payloadForm} />
                          </div>
                        ) : (
                          <>
                            <Field
                              as="textarea"
                              id="payload"
                              name="payload"
                              placeholder="// Enter your payload here"
                              className={clsx(styles.field, styles.textarea)}
                            />
                            {errors.payload && touched.payload ? (
                              <div className={styles.error}>{errors.payload}</div>
                            ) : null}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.meta}>
                    <span className={styles.title}>Metadata: </span>
                    <MetaSwitch
                      isMetaFromFile={isMetaFromFile}
                      onChange={setIsMetaFromFile}
                      className={styles.formField}
                    />
                    {isMetaFromFile && (
                      <MetaFile
                        file={droppedMetaFile}
                        onUpload={handleUploadMetaFile}
                        onDelete={resetMetaForm}
                        className={styles.formField}
                      />
                    )}
                    {metaFields?.map((field) => (
                      <MetaField
                        key={field}
                        name={field}
                        label={`${field}:`}
                        fieldAs={field === 'types' ? 'textarea' : 'input'}
                        disabled={isMetaFromFile}
                        className={styles.formField}
                      />
                    ))}
                  </div>
                </div>
                <Buttons
                  handleCalculateGas={() => {
                    handleCalculateGas(values, setFieldValue);
                  }}
                  handleResetForm={handleResetForm}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
