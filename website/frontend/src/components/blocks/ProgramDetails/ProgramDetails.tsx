import React, { useState, useRef, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2 } from 'react-feather';
import NumberFormat from 'react-number-format';
import { Metadata, getWasmMetadata, parseHexTypes, getTypeStructure } from '@gear-js/api';
import { Formik, Form, Field } from 'formik';
import { ParsedShape, parseMeta } from 'utils/meta-parser';
import { EventTypes } from 'types/alerts';
import { FormItem } from 'components/FormItem';
import { Switch } from 'common/components/Switch';
import { Schema } from './Schema';
import { useApi } from 'hooks/useApi';
import { AddAlert } from 'store/actions/actions';
import { RootState } from 'store/reducers';
import { UploadProgram } from 'services/ApiService';
import { readFileAsync, checkFileFormat } from 'helpers';
import { MIN_GAS_LIMIT } from 'consts';
import deselected from 'assets/images/radio-deselected.svg';
import selected from 'assets/images/radio-selected.svg';
import './ProgramDetails.scss';

type Props = {
  setDroppedFile: (file: File | null) => void;
  droppedFile: File;
};

export const ProgramDetails: VFC<Props> = ({ setDroppedFile, droppedFile }) => {
  const [api] = useApi();
  const dispatch = useDispatch();
  const currentAccount = useSelector((state: RootState) => state.account.account);
  const metaFieldRef = useRef<HTMLDivElement | null>(null);

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
  });

  const isShowFields = (isMetaFromFile && droppedMetaFile) || !isMetaFromFile;
  const isShowMetaSwitch = isMetaFromFile && meta;
  const isShowMetaForm = isMetaFromFile && metaForm && !isManualPaylod;

  const uploadMetaFile = () => {
    metaFieldRef.current?.click();
  };

  const handleUploadMetaFile = async (file: File) => {
    try {
      const fileBuffer = (await readFileAsync(file)) as Buffer;
      const metaWasm = await getWasmMetadata(fileBuffer);

      if (metaWasm && metaWasm.types && metaWasm.handle_input) {
        const bufstr = Buffer.from(new Uint8Array(fileBuffer)).toString('base64');
        const displayedTypes = parseHexTypes(metaWasm.types);
        const inputType = getTypeStructure(metaWasm.handle_input, displayedTypes);
        const parsedMeta = parseMeta(inputType);

        setMeta(metaWasm);
        setMetaFile(bufstr);
        setMetaForm(parsedMeta);
        setInitialValues({
          ...initialValues,
          initPayload: JSON.stringify(inputType, null, 4),
          init_input: JSON.stringify(metaWasm.init_input),
          handle_input: JSON.stringify(metaWasm.handle_input),
          init_output: JSON.stringify(metaWasm.init_output),
          handle_output: JSON.stringify(metaWasm.handle_output),
          types: JSON.stringify(inputType),
        });
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

    setInitialValues({
      gasLimit: MIN_GAS_LIMIT,
      value: 0,
      initPayload: '',
      init_input: '',
      init_output: '',
      handle_input: '',
      handle_output: '',
      types: '',
      fields: {},
    });
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

  return (
    <div className="program-details">
      <h3 className="program-details__header">UPLOAD NEW PROGRAM</h3>

      <Formik
        initialValues={initialValues}
        validationSchema={Schema}
        validateOnBlur
        enableReinitialize
        onSubmit={handleSubmitForm}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form>
            <div className="program-details__download">
              <progress className="program-details__progress" max="100" value="65" />
              <div className="program-details__progress-value" />
              <div className="program-details__progress-bg">
                <div className="program-details__progress-bar" />
              </div>
            </div>
            <div className="program-details__wrapper">
              <div className="program-details__columns">
                <div className="program-details__column-left">
                  <div className="program-details__info">
                    <span className="program-details__title">File:</span>
                    <div className="program-details__value program-details__value_filename">
                      {droppedFile.name}
                      <button type="button" onClick={handleResetForm}>
                        <Trash2 color="#ffffff" size="20" strokeWidth="1" />
                      </button>
                    </div>
                  </div>
                  <div className="program-details__info">
                    <label htmlFor="gasLimit" className="program-details__title">
                      Gas limit:
                    </label>
                    <div className="program-details__value">
                      <NumberFormat
                        name="gasLimit"
                        placeholder="20,000,000"
                        value={values.gasLimit}
                        thousandSeparator
                        allowNegative={false}
                        className="program-details__input"
                        onValueChange={(val) => {
                          const { floatValue } = val;
                          setFieldValue('gasLimit', floatValue);
                        }}
                      />
                      {errors.gasLimit && touched.gasLimit ? (
                        <div className="program-details__error">{errors.gasLimit}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="program-details__info">
                    <label htmlFor="value" className="program-details__title">
                      Initial value:
                    </label>
                    <div className="program-details__value">
                      <Field id="value" name="value" placeholder="0" className="program-details__input" type="number" />
                      {errors.value && touched.value ? (
                        <div className="program-details__error">{errors.value}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="program-details__info">
                    <label htmlFor="initPayload" className="program-details__title program-details__title_top">
                      Initial payload:
                    </label>
                    <div className="program-details__value program-details__value_payload">
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
                            className="program-details__input program-details__input_textarea"
                          />
                          {errors.initPayload && touched.initPayload ? (
                            <div className="program-details__error">{errors.initPayload}</div>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="program-details__column-right">
                  <span className="program-details__column-title">Metadata: </span>
                  <div className="program-details__info">
                    <span className="program-details__title">Metadata: </span>
                    <div className="program-details__switch-btns">
                      <button
                        type="button"
                        className="program-details__switch-btn"
                        onClick={() => setIsMetaFromFile(true)}
                      >
                        <img src={isMetaFromFile ? selected : deselected} alt="radio" />
                        Upload file
                      </button>
                      <button
                        type="button"
                        className="program-details__switch-btn"
                        onClick={() => setIsMetaFromFile(false)}
                      >
                        <img src={isMetaFromFile ? deselected : selected} alt="radio" />
                        Manual input
                      </button>
                    </div>
                  </div>
                  {isMetaFromFile && (
                    <div className="program-details__info">
                      <label htmlFor="meta" className="program-details__title">
                        Metadata file:
                      </label>
                      <Field
                        id="meta"
                        name="meta"
                        className="is-hidden"
                        type="file"
                        innerRef={metaFieldRef}
                        onChange={handleChangeMetaFile}
                      />
                      {droppedMetaFile ? (
                        <div className="program-details__value program-details__value_filename">
                          {droppedFile.name}
                          <button type="button" onClick={handleRemoveMetaFile}>
                            <Trash2 color="#ffffff" size="20" strokeWidth="1" />
                          </button>
                        </div>
                      ) : (
                        <button className="program-details__file-btn" type="button" onClick={uploadMetaFile}>
                          Select file
                        </button>
                      )}
                    </div>
                  )}
                  {isShowFields && (
                    <>
                      <div className="program-details__info">
                        <label htmlFor="init_input" className="program-details__title">
                          Initial type:
                        </label>
                        <div className="program-details__value">
                          <Field
                            id="init_input"
                            name="init_input"
                            className="program-details__input"
                            type="text"
                            disabled={isMetaFromFile}
                          />
                          {errors.init_input && touched.init_input ? (
                            <div className="program-details__error">{errors.init_input}</div>
                          ) : null}
                        </div>
                      </div>
                      <div className="program-details__info">
                        <label htmlFor="input" className="program-details__title">
                          Incoming type:
                        </label>
                        <div className="program-details__value">
                          <Field
                            id="handle_input"
                            name="handle_input"
                            className="program-details__input"
                            type="text"
                            disabled={isMetaFromFile}
                          />
                          {errors.handle_input && touched.handle_input ? (
                            <div className="program-details__error">{errors.handle_input}</div>
                          ) : null}
                        </div>
                      </div>
                      <div className="program-details__info">
                        <label htmlFor="output" className="program-details__title">
                          Expected type:
                        </label>
                        <div className="program-details__value">
                          <Field
                            id="handle_output"
                            name="handle_output"
                            className="program-details__input"
                            type="text"
                            disabled={isMetaFromFile}
                          />
                          {errors.handle_output && touched.handle_output ? (
                            <div className="program-details__error">{errors.handle_output}</div>
                          ) : null}
                        </div>
                      </div>
                      <div className="program-details__info">
                        <label htmlFor="init_output" className="program-details__title">
                          Initial output type:
                        </label>
                        <div className="program-details__value">
                          <Field
                            id="init_output"
                            name="init_output"
                            className="program-details__input"
                            type="text"
                            disabled={isMetaFromFile}
                          />
                          {errors.init_output && touched.init_output ? (
                            <div className="program-details__error">{errors.init_output}</div>
                          ) : null}
                        </div>
                      </div>
                      <div className="program-details__info">
                        <label htmlFor="types" className="program-details__title program-details__title_top">
                          Types:
                        </label>
                        <div className="program-details__value">
                          <Field
                            as="textarea"
                            id="types"
                            name="types"
                            className="program-details__input program-details__input_textarea"
                            disabled={isMetaFromFile}
                          />
                          {errors.types && touched.types ? (
                            <div className="program-details__error">{errors.types}</div>
                          ) : null}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="program-details__buttons">
                <button type="submit" className="program-details__upload" aria-label="uploadProgramm">
                  Upload program
                </button>
                <button
                  type="button"
                  className="program-details__cancel"
                  aria-label="closeProgramDetails"
                  onClick={handleResetForm}
                >
                  Cancel upload
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
