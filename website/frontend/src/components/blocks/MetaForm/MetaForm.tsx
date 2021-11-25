import React, { useCallback, useRef, useState, VFC } from 'react';
import { getWasmMetadata } from '@gear-js/api';
import { Field, Form, Formik } from 'formik';
import clsx from 'clsx';
import { fileNameHandler } from 'helpers';
import { MetaModel } from 'types/program';
import { addMetadata } from 'services/ApiService';
import cancel from 'assets/images/cancel.svg';
import deselected from 'assets/images/radio-deselected.svg';
import selected from 'assets/images/radio-selected.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import { AddAlert } from 'store/actions/actions';
import { EventTypes } from 'types/events';
import { readFileAsync } from '../../../helpers';
import { Schema } from './Schema';
import './MetaForm.scss';

type Props = {
  programHash: string;
  programName: string;
  handleClose: () => void;
};

export const MetaForm: VFC<Props> = ({ programName, programHash }) => {
  const [isMetaByFile, setIsMetaByFile] = useState(true);
  const [metaWasm, setMetaWasm] = useState<any>(null);
  const [droppedMetaFile, setDroppedMetaFile] = useState<File | null>(null);
  const [wrongMetaFormat, setWrongMetaFormat] = useState(false);
  const dispatch = useDispatch();
  const currentAccount = useSelector((state: RootState) => state.account.account);

  const metaFieldRef = useRef<any>(null);

  if (wrongMetaFormat) {
    setTimeout(() => setWrongMetaFormat(false), 3000);
  }

  const metadata = {
    init_input: '',
    init_output: '',
    handle_input: '',
    handle_output: '',
    title: '',
    types: '',
    name: 'default.wasm',
  };

  const removeMetaFile = () => {
    setDroppedMetaFile(null);
  };

  const uploadMetaFile = () => {
    metaFieldRef.current?.click();
  };

  const handleFilesUpload = useCallback(
    async (file) => {
      try {
        const fileBuffer: any = await readFileAsync(file);
        const meta = await getWasmMetadata(fileBuffer);
        setMetaWasm(meta);
      } catch (error) {
        dispatch(AddAlert({ type: EventTypes.ERROR, message: `${error}` }));
      }
      setDroppedMetaFile(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setDroppedMetaFile]
  );

  const checkFileFormat = useCallback((files: any) => {
    // eslint-disable-next-line no-console
    if (typeof files[0]?.name === 'string') {
      const fileExt: string = files[0].name.split('.').pop().toLowerCase();
      return fileExt !== 'wasm';
    }
    return true;
  }, []);

  const handleMetaInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (files?.length) {
      const isCorrectFormat = checkFileFormat(files);
      setWrongMetaFormat(isCorrectFormat);
      if (!isCorrectFormat) {
        handleFilesUpload(files[0]);
      }
    }
  };

  const handleTypeChange = (value: boolean) => {
    if (!value) {
      setDroppedMetaFile(null);
    }
    setIsMetaByFile(value);
  };

  return (
    <Formik
      initialValues={metadata}
      validationSchema={Schema}
      validateOnBlur
      onSubmit={(values: MetaModel, { resetForm }) => {
        if (currentAccount) {
          if (isMetaByFile) {
            if (metaWasm) {
              addMetadata(metaWasm, currentAccount, programHash, values.name, dispatch);
            } else {
              dispatch(AddAlert({ type: EventTypes.ERROR, message: `ERROR: metadata not loaded` }));
            }
          } else {
            const { name, ...meta } = values;
            addMetadata(meta, currentAccount, programHash, name, dispatch);
          }
          resetForm();
        } else {
          dispatch(AddAlert({ type: EventTypes.ERROR, message: `WALLET NOT CONNECTED` }));
        }
      }}
    >
      {({ errors, touched }) => (
        <Form id="meta-form">
          <div className="meta-form--wrapper">
            <div className="meta-form--col">
              <div className="meta-form--info">
                <span>File:</span>
                <span>{fileNameHandler(programName)}</span>
              </div>
              <div className="meta-form--info">
                <p className="meta-form__field">Metadata: </p>
                <div className="meta-form--switch-btns">
                  <button type="button" className="meta-form--switch-btns__btn" onClick={() => handleTypeChange(true)}>
                    <img src={isMetaByFile ? selected : deselected} alt="radio" />
                    Upload file
                  </button>
                  <button type="button" className="meta-form--switch-btns__btn" onClick={() => handleTypeChange(false)}>
                    <img src={isMetaByFile ? deselected : selected} alt="radio" />
                    Manual input
                  </button>
                </div>
              </div>

              {(isMetaByFile && (
                <>
                  <div className="meta-form--info">
                    <label htmlFor="name" className="meta-form__field">
                      Program name:
                    </label>
                    <div className="meta-form__field-wrapper">
                      <Field
                        id="name"
                        name="name"
                        type="text"
                        className={clsx('', errors.name && touched.name && 'meta-form__input-error')}
                      />
                      {errors.name && touched.name ? <div className="meta-form__error">{errors.name}</div> : null}
                    </div>
                  </div>
                  <div className="meta-form--info">
                    <label className="meta-form__field" htmlFor="meta">
                      Upload file:{' '}
                    </label>
                    <Field
                      id="meta"
                      name="meta"
                      className="is-hidden"
                      type="file"
                      onChange={handleMetaInputChange}
                      innerRef={metaFieldRef}
                    />
                    {(droppedMetaFile && (
                      <div className="meta-form__filename meta-form__value">
                        {droppedMetaFile.name.replace(`.${droppedMetaFile.name.split('.').pop()}`, '')}.
                        {droppedMetaFile.name.split('.').pop()}
                        <button type="button" onClick={removeMetaFile}>
                          <img alt="cancel" src={cancel} />
                        </button>
                      </div>
                    )) || (
                      <button className="meta-form--file-btn" type="button" onClick={uploadMetaFile}>
                        Select file
                      </button>
                    )}
                  </div>
                </>
              )) || (
                <>
                  <div className="meta-form--info">
                    <label htmlFor="name" className="meta-form__field">
                      Program name:
                    </label>
                    <div className="meta-form__field-wrapper">
                      <Field
                        id="name"
                        name="name"
                        type="text"
                        className={clsx('', errors.name && touched.name && 'meta-form__input-error')}
                      />
                      {errors.name && touched.name ? <div className="meta-form__error">{errors.name}</div> : null}
                    </div>
                  </div>
                  <div className="meta-form--info">
                    <label htmlFor="init_input" className="meta-form__field">
                      Initial type:
                    </label>
                    <div className="meta-form__field-wrapper">
                      <Field
                        id="init_input"
                        name="init_input"
                        type="text"
                        className={clsx('', errors.init_input && touched.init_input && 'meta-form__input-error')}
                      />
                      {errors.init_input && touched.init_input ? (
                        <div className="meta-form__error">{errors.init_input}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="meta-form--info">
                    <label htmlFor="init_output" className="meta-form__field">
                      Initial output type:
                    </label>
                    <div className="meta-form__field-wrapper">
                      <Field
                        id="init_output"
                        name="init_output"
                        type="text"
                        className={clsx('', errors.init_output && touched.init_output && 'meta-form__input-error')}
                      />
                      {errors.init_output && touched.init_output ? (
                        <div className="meta-form__error">{errors.init_output}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="meta-form--info">
                    <label htmlFor="input" className="meta-form__field">
                      Incoming type:
                    </label>
                    <div className="meta-form__field-wrapper">
                      <Field
                        id="input"
                        name="input"
                        type="text"
                        className={clsx('', errors.handle_input && touched.handle_input && 'meta-form__input-error')}
                      />
                      {errors.handle_input && touched.handle_input ? (
                        <div className="meta-form__error">{errors.handle_input}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="meta-form--info">
                    <label htmlFor="output" className="meta-form__field">
                      Expected type:
                    </label>
                    <div className="meta-form__field-wrapper">
                      <Field
                        id="output"
                        name="output"
                        type="text"
                        className={clsx('', errors.handle_output && touched.handle_output && 'meta-form__input-error')}
                      />
                      {errors.handle_output && touched.handle_output ? (
                        <div className="meta-form__error">{errors.handle_output}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="meta-form--info">
                    <label htmlFor="types" className="meta-form__field">
                      Types:
                    </label>
                    <div className="meta-form__field-wrapper">
                      <Field
                        as="textarea"
                        id="types"
                        name="types"
                        className={clsx('', errors.types && touched.types && 'meta-form__input-error')}
                      />
                      {errors.types && touched.types ? <div className="meta-form__error">{errors.types}</div> : null}
                    </div>
                  </div>
                </>
              )}
              <button className="meta-form__button" type="submit">
                Upload metadata
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
