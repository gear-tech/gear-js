import React, { Dispatch, SetStateAction, useState, VFC } from 'react';
import { useAlert } from 'react-alert';
import clsx from 'clsx';
import { Trash2 } from 'react-feather';
import NumberFormat from 'react-number-format';
import { Metadata, getWasmMetadata, createPayloadTypeStructure, decodeHexTypes } from '@gear-js/api';
import { Checkbox } from '@gear-js/ui';
import { Formik, Form, Field } from 'formik';
import { InitialValues } from './types';
import { SetFieldValue } from 'types/common';
import { MetaFieldsStruct, parseMeta, prepareToSend, MetaFields as MetaForm } from 'components/MetaFields';

import { MetaSwitch } from './children/MetaSwitch/MetaSwitch';
import { MetaFile } from './children/MetaFile/MetaFile';
import { MetaFields } from './children/MetaFields/MetaFields';
import { Buttons } from './children/Buttons/Buttons';

import { Schema } from './Schema';
import { useAccount, useApi, useLoading } from 'hooks';
import { UploadProgram } from 'services/ApiService';
import { readFileAsync, getPreformattedText, calculateGas } from 'helpers';
import { MIN_GAS_LIMIT } from 'consts';
import { META_FIELDS } from './consts';
import { DroppedFile } from '../../types';
import styles from './UploadForm.module.scss';

const INITIAL_VALUES = {
  gasLimit: MIN_GAS_LIMIT,
  value: 0,
  payload: '0x00',
  __root: null,
  programName: '',
};

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
  const [initialValues, setInitialValues] = useState<InitialValues>(INITIAL_VALUES);

  const isShowFields = (isMetaFromFile && droppedMetaFile) || !isMetaFromFile;
  const isShowPayloadForm = payloadForm && !isManualPayload;
  const handleUploadMetaFile = async (file: File) => {
    try {
      const fileBuffer = (await readFileAsync(file)) as Buffer;
      const metaWasm: { [key: string]: any } = await getWasmMetadata(fileBuffer);

      if (metaWasm) {
        const bufstr = Buffer.from(new Uint8Array(fileBuffer)).toString('base64');
        const decodedTypes = decodeHexTypes(metaWasm?.types);
        const typeStructure = createPayloadTypeStructure(metaWasm?.init_input, decodedTypes, true);
        const parsedStructure = parseMeta(typeStructure);

        let valuesFromFile = {};

        for (const key in metaWasm) {
          if (META_FIELDS.includes(key) && metaWasm[key] && key !== 'types') {
            valuesFromFile = {
              ...valuesFromFile,
              [key]: JSON.stringify(metaWasm[key]),
            };
          }
        }

        valuesFromFile = {
          ...valuesFromFile,
          types: getPreformattedText(decodedTypes),
        };

        setMeta(metaWasm);
        setMetaFile(bufstr);
        setPayloadForm(parsedStructure);
        setInitialValues({
          ...initialValues,
          ...valuesFromFile,
          programName: metaWasm.title,
          payload: getPreformattedText(typeStructure),
        });
        setFieldFromFile([...Object.keys(valuesFromFile)]);
      }
    } catch (error) {
      alert.error(`${error}`);
    }
    setDroppedMetaFile(file);
  };

  const resetMetaForm = () => {
    setMeta(null);
    setMetaFile(null);
    setPayloadForm(null);
    setDroppedMetaFile(null);
    setFieldFromFile(null);

    setInitialValues(INITIAL_VALUES);
  };

  const handleSubmitForm = (values: any) => {
    if (currentAccount) {
      if (isMetaFromFile) {
        const pl = isManualPayload ? values.payload : prepareToSend(values.__root);
        const updatedValues = { ...values, initPayload: pl };

        UploadProgram(
          api,
          currentAccount,
          droppedFile,
          { ...updatedValues, ...meta },
          metaFile,
          enableLoading,
          disableLoading,
          alert,
          () => {
            setDroppedFile(null);
          }
        );
      } else {
        try {
          const manualTypes = values.types.length > 0 ? JSON.parse(values.types) : values.types;
          UploadProgram(
            api,
            currentAccount,
            droppedFile,
            { ...values, types: manualTypes },
            null,
            enableLoading,
            disableLoading,
            alert,
            () => {
              setDroppedFile(null);
            }
          );
        } catch (error) {
          alert.error(`Invalid JSON format`);
        }
      }
    } else {
      alert.error(`Wallet not connected`);
    }
  };

  const handleResetForm = () => {
    setDroppedFile(null);
    setDroppedMetaFile(null);
  };

  const handleCalculateGas = async (values: InitialValues, setFieldValue: SetFieldValue) => {
    const fileBuffer = (await readFileAsync(droppedFile)) as ArrayBuffer;
    const code = Buffer.from(new Uint8Array(fileBuffer));

    calculateGas('init', api, isManualPayload, values, setFieldValue, alert, meta, code);
  };

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
                    <MetaSwitch isMetaFromFile={isMetaFromFile} setIsMetaFromFile={setIsMetaFromFile} />
                    {isMetaFromFile && (
                      <MetaFile
                        droppedMetaFile={droppedMetaFile}
                        handleUploadMetaFile={handleUploadMetaFile}
                        resetMetaForm={resetMetaForm}
                      />
                    )}
                    {isShowFields && (
                      <MetaFields fields={isMetaFromFile ? fieldFromFile : META_FIELDS} isDisabled={isMetaFromFile} />
                    )}
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
