import React, { useCallback, useRef, useState, VFC } from 'react';
import { getWasmMetadata, parseHexTypes } from '@gear-js/api';
import { useDispatch } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import clsx from 'clsx';
import { fileNameHandler } from 'helpers';
import { MetaModel } from 'types/program';
import { addMetadata } from 'services/ApiService';
import cancel from 'assets/images/cancel.svg';
import deselected from 'assets/images/radio-deselected.svg';
import selected from 'assets/images/radio-selected.svg';
import { useAlert } from 'react-alert';
import { readFileAsync } from '../../../helpers';
import { Schema } from './Schema';
import './MetaForm.scss';

type Props = {
  programHash: string;
  programName: string;
  handleClose: () => void;
};

export const MetaForm: VFC<Props> = ({ programName, programHash, handleClose }) => {
  const dispatch = useDispatch();

  const alert = useAlert();

  const [isMetaByFile, setIsMetaByFile] = useState(true);
  const [metaWasm, setMetaWasm] = useState<any>(null);
  const [droppedMetaFile, setDroppedMetaFile] = useState<File | null>(null);
  const [wrongMetaFormat, setWrongMetaFormat] = useState(false);

  const metaFieldRef = useRef<any>(null);

  if (wrongMetaFormat) {
    setTimeout(() => setWrongMetaFormat(false), 3000);
  }

  const metadata = {
    init_input: '',
    init_output: '',
    input: '',
    output: '',
    title: '',
    types: '',
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
        let types = '';
        const parsedTypes = parseHexTypes(meta.types);
        Object.entries(parsedTypes).forEach((value) => {
          types += `${value[0]}: ${JSON.stringify(value[1])}\n`;
        });
        setMetaWasm({...meta, types});
        
      } catch (error) {
        alert.error(`${error}`);
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
      onSubmit={(values: MetaModel) => {
        addMetadata(metaWasm, programHash, droppedMetaFile, dispatch, alert);
        console.log(values);
      }}
      onReset={handleClose}
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
              )) || (
                <>
                  <div className="meta-form--info">
                    <label htmlFor="incomingType" className="meta-form__field">
                      Incoming type:
                    </label>
                    <div className="meta-form__field-wrapper">
                      <Field
                        id="incomingType"
                        name="incomingType"
                        type="text"
                        className={clsx('', errors.input && touched.input && 'meta-form__input-error')}
                      />
                      {errors.input && touched.input ? (
                        <div className="meta-form__error">{errors.input}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="meta-form--info">
                    <label htmlFor="expectedType" className="meta-form__field">
                      Expected type:
                    </label>
                    <div className="meta-form__field-wrapper">
                      <Field
                        id="expectedType"
                        name="expectedType"
                        type="text"
                        className={clsx('', errors.output && touched.output && 'meta-form__input-error')}
                      />
                      {errors.output && touched.output ? (
                        <div className="meta-form__error">{errors.output}</div>
                      ) : null}
                    </div>
                  </div>
                </>
              )}
              <button className="meta-form__button" type="submit">
                Upload program
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
