import React, { useState, useRef, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { Trash2 } from 'react-feather';
import NumberFormat from 'react-number-format';
import { Metadata, getWasmMetadata, parseHexTypes, getTypeStructure } from '@gear-js/api';
import { Formik, Form, Field } from 'formik';
import { ParsedShape, parseMeta } from 'utils/meta-parser';
import { EventTypes } from 'types/alerts';
import { FormItem } from 'components/FormItem';
import { Switch } from 'common/components/Switch';

import { MetaSwitch } from './children/MetaSwitch/MetaSwitch';
import { MetaFile } from './children/MetaFile/MetaFile';
import { MetaFields } from './children/MetaFields/MetaFields';
import { Buttons } from './children/Buttons/Buttons';

import { Schema } from './Schema';
import { useApi } from 'hooks/useApi';
import { AddAlert } from 'store/actions/actions';
import { RootState } from 'store/reducers';
import { UploadProgram } from 'services/ApiService';
import { readFileAsync, checkFileFormat } from 'helpers';
import { MIN_GAS_LIMIT, META_FIELDS } from 'consts';
import styles from './UploadForm.module.scss';

type Props = {
  setDroppedFile: (file: File | null) => void;
  droppedFile: File;
};

export const UploadForm: VFC<Props> = ({ setDroppedFile, droppedFile }) => {
  const [api] = useApi();
  const dispatch = useDispatch();
  const currentAccount = useSelector((state: RootState) => state.account.account);

  const [fieldFromFile, setFieldFromFile] = useState<String[] | null>(null);
  const [meta, setMeta] = useState<Metadata | null>(null);
  const [metaFile, setMetaFile] = useState<string | null>(null);
  const [droppedMetaFile, setDroppedMetaFile] = useState<File | null>(null);
  const [metaForm, setMetaForm] = useState<ParsedShape | null>();
  const [isMetaFromFile, setIsMetaFromFile] = useState<boolean>(true);
  const [isManualPaylod, setIsManualPaylod] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState({
    gasLimit: MIN_GAS_LIMIT,
    value: 0,
    initPayload: '',
    init_input: '',
    init_output: '',
    handle_input: '',
    handle_output: '',
    types: '',
    fields: {},
    programName: '',
  });

  const isShowFields = (isMetaFromFile && droppedMetaFile) || !isMetaFromFile;
  const isShowMetaSwitch = isMetaFromFile && meta;
  const isShowMetaForm = isMetaFromFile && metaForm && !isManualPaylod;

  const handleUploadMetaFile = async (file: File) => {
    try {
      const fileBuffer = (await readFileAsync(file)) as Buffer;
      const metaWasm: { [key: string]: any } = await getWasmMetadata(fileBuffer);

      if (metaWasm && metaWasm.types && metaWasm.handle_input) {
        const bufstr = Buffer.from(new Uint8Array(fileBuffer)).toString('base64');
        const displayedTypes = parseHexTypes(metaWasm.types);
        const inputType = getTypeStructure(metaWasm.handle_input, displayedTypes);
        const parsedMeta = parseMeta(inputType);
        let valuesFromFile = {};

        for (const key in metaWasm) {
          if (META_FIELDS.includes(key) && metaWasm[key]) {
            valuesFromFile = {
              ...valuesFromFile,
              [key]: JSON.stringify(metaWasm[key]),
            };
          }
        }

        setMeta(metaWasm);
        setMetaFile(bufstr);
        setMetaForm(parsedMeta);
        setInitialValues({
          ...initialValues,
          ...valuesFromFile,
          programName: metaWasm.title,
        });
        setFieldFromFile([...Object.keys(valuesFromFile).reverse()]);
      }
    } catch (error) {
      dispatch(AddAlert({ type: EventTypes.ERROR, message: `${error}` }));
    }
    setDroppedMetaFile(file);
  };

  const handleRemoveMetaFile = () => {
    setMeta(null);
    setMetaFile(null);
    setMetaForm(null);
    setDroppedMetaFile(null);
    setFieldFromFile(null);
  };

  const handleChangeMetaFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length) {
      const isCorrectFormat = checkFileFormat(event.target.files[0]);

      if (isCorrectFormat) {
        handleUploadMetaFile(event.target.files[0]);
      } else {
        dispatch(AddAlert({ type: EventTypes.ERROR, message: 'Wrong file format' }));
      }
    }
  };

  const handleSubmitForm = (values: any) => {
    if (currentAccount) {
      if (isMetaFromFile) {
        let pl = values.fields;
        if (isManualPaylod) {
          pl = values.initPayload;
        }

        const updatedValues = { ...values, initPayload: pl };

        UploadProgram(api, currentAccount, droppedFile, { ...updatedValues, ...meta }, metaFile, dispatch, () => {
          setDroppedFile(null);
        });
      } else {
        try {
          const manualTypes = values.types.length > 0 ? JSON.parse(values.types) : values.types;
          UploadProgram(api, currentAccount, droppedFile, { ...values, types: manualTypes }, null, dispatch, () => {
            setDroppedFile(null);
          });
        } catch (error) {
          dispatch(AddAlert({ type: EventTypes.ERROR, message: `Invalid JSON format` }));
        }
      }
    } else {
      dispatch(AddAlert({ type: EventTypes.ERROR, message: `Wallet not connected` }));
    }
  };

  const handleResetForm = () => {
    setDroppedFile(null);
    setDroppedMetaFile(null);
  };

  const getFields = () => {
    if (isMetaFromFile) {
      return fieldFromFile;
    }

    return META_FIELDS;
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
              <div className={styles.download}>
                <progress className={styles.progress} max="100" value="65" />
                <div className={styles.progressValue} />
                <div className={styles.progressBg}>
                  <div className={styles.progressBar} />
                </div>
              </div>

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
                      <label htmlFor="initPayload" className={clsx(styles.caption, styles.top)}>
                        Initial payload:
                      </label>
                      <div className={clsx(styles.value, styles.payload)}>
                        {isShowMetaSwitch && (
                          <Switch
                            onChange={() => setIsManualPaylod(!isManualPaylod)}
                            label="Manual input"
                            checked={isManualPaylod}
                          />
                        )}
                        {isShowMetaForm ? (
                          <div className="message-form--info">
                            <FormItem data={metaForm} />
                          </div>
                        ) : (
                          <>
                            <Field
                              as="textarea"
                              id="initPayload"
                              name="initPayload"
                              placeholder="// Enter your payload here"
                              className={clsx(styles.field, styles.textarea)}
                            />
                            {errors.initPayload && touched.initPayload ? (
                              <div className={styles.error}>{errors.initPayload}</div>
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
                        handleRemoveMetaFile={handleRemoveMetaFile}
                        handleChangeMetaFile={handleChangeMetaFile}
                      />
                    )}
                    {isShowFields && (
                      <MetaFields fields={getFields()} isDisabled={isMetaFromFile} errors={errors} touched={touched} />
                    )}
                  </div>
                </div>
                <Buttons handleResetForm={handleResetForm} />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
