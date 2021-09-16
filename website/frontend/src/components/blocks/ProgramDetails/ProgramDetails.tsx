import React, { useState, useCallback, useRef } from 'react';
import { getWasmMetadata } from '@gear-js/api';

import { Formik, Form, Field } from 'formik';

import { UploadProgramModel } from 'types/program';

import { useDispatch } from 'react-redux';

import { SocketService } from 'services/SocketService';

import { programUploadStartAction } from 'store/actions/actions';

import StatusPanel from 'components/blocks/StatusPanel';


import './ProgramDetails.scss';

import cancel from 'images/cancel.svg';
import close from 'images/close.svg';
import deselected from 'images/radio-deselected.svg';
import selected from 'images/radio-selected.svg';

import { Schema } from './Schema';
import { readFileAsync } from '../../../helpers'

type ProgramDetailsTypes = {
  setDroppedFile: (file: File | null) => void;
  droppedFile: File;
  socketService: SocketService;
};

const ProgramDetails = ({ setDroppedFile, droppedFile, socketService }: ProgramDetailsTypes) => {
  const dispatch = useDispatch();

  const [isMetaByFile, setIsMetaByFile] = useState(true);
  const [droppedMetaFile, setDroppedMetaFile] = useState<File | null>(null);
  const [wrongMetaFormat, setWrongMetaFormat] = useState(false);
  const [wrongJSON, setWrongJSON] = useState(false);

  const [type, setType] = useState(null);
  const [typeInput, setTypeInput] = useState('');

  const [program, setProgram] = useState<any>({
    gasLimit: 20000,
    value: 0,
    initPayload: '',
    init_input: '',
    init_output: '',
    input: '',
    output: '',
    types: '',
  });

  const metaFieldRef = useRef<any>(null);

  if (wrongMetaFormat) {
    setTimeout(() => setWrongMetaFormat(false), 3000);
  }

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
        console.log(meta)
        setProgram({
          ...program,
          init_input: meta.init_input,
          init_output: meta.init_output,
          input: meta.input,
          output: meta.output,
          types: meta.types,
        });

      } catch(err) {
        console.log(err);
      }
      setDroppedMetaFile(file);
    },
    [setDroppedMetaFile, program]
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

  const prettyPrint = () => {
    const pretty = JSON.stringify(type, undefined, 4);
    setTypeInput(pretty);
  };

  const handleTypesInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypeInput(event.target.value);
    const types = JSON.parse(typeInput);
    console.log(types);
    setType(types);
  };

  return (
    <div className="program-details">
      <h3 className="program-details__header">UPLOAD NEW PROGRAM</h3>
      <Formik
        initialValues={program}
        validationSchema={Schema}
        validateOnBlur
        onSubmit={(values: UploadProgramModel) => {
          dispatch(programUploadStartAction());
          try {
            const typesObj = JSON.parse(values.types);
            socketService.uploadProgram(droppedFile, { ...values, types: typesObj });
            setDroppedFile(null);
          } catch(err){
            console.log(err)
          }
        }}
        onReset={() => {
          setDroppedFile(null);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            {/* eslint-disable react/button-has-type */}
            <button type="reset" aria-label="closeButton">
              <img src={close} alt="close" className="program-details__close" />
            </button>
            {/* eslint-disable react/button-has-type */}
            <div className="program-details__download">
              <progress className="program-details__progress" max="100" value="65" />
              <div className="program-details__progress-value" />
              <div className="program-details__progress-bg">
                <div className="program-details__progress-bar" />
              </div>
            </div>
            <div className="program-details__wrapper">
              <div className="program-details__wrapper-column1">
                <div className="program-details__info">
                  <span className="program-details__field-file program-details__field">File:</span>
                  <div className="program-details__filename program-details__value">
                    {droppedFile.name.replace(`.${droppedFile.name.split('.').pop()}`, '')}.
                    {droppedFile.name.split('.').pop()}
                    <button type="reset">
                      <img alt="cancel" src={cancel} />
                    </button>
                  </div>
                </div>
                <div className="program-details__info">
                  <label htmlFor="gasLimit" className="program-details__field-limit program-details__field">
                    Gas limit:
                  </label>
                  <div className="program-details__field-wrapper">
                    <Field
                      id="gasLimit"
                      name="gasLimit"
                      placeholder="20000"
                      className="program-details__limit-value program-details__value"
                      type="number"
                    />
                    {errors.gasLimit && touched.gasLimit ? (
                      <div className="program-details__error">{errors.gasLimit}</div>
                    ) : null}
                  </div>
                </div>
                <div className="program-details__info">
                  <label
                    htmlFor="initPayload"
                    className="program-details__field-init-parameters program-details__field"
                  >
                    Initial parameters:
                  </label>
                  <div className="program-details__field-wrapper">
                    <Field
                      id="initPayload"
                      name="initPayload"
                      className="program-details__init-parameters-value program-details__value"
                    />
                    {errors.initPayload && touched.initPayload ? (
                      <div className="program-details__error">{errors.initPayload}</div>
                    ) : null}
                  </div>
                </div>

                <div className="program-details__info">
                  <label htmlFor="value" className="program-details__field-init-value program-details__field">
                    Initial value:
                  </label>
                  <div className="program-details__field-wrapper">
                    <Field
                      id="value"
                      name="value"
                      placeholder="0"
                      className="program-details__init-value program-details__value"
                      type="number"
                    />
                    {errors.value && touched.value ? (
                      <div className="program-details__error">{errors.value}</div>
                    ) : null}
                  </div>
                </div>
                <div className="program-details__info">
                  <p className="program-details__field">Metadata: </p>
                  <div className="program-details--switch-btns">
                  <button
                      type="button"
                      className="program-details--switch-btns__btn"
                      onClick={() => setIsMetaByFile(true)}
                    >
                      <img src={isMetaByFile ? selected : deselected} alt="radio" />
                      Upload file
                    </button>
                    <button
                      type="button"
                      className="program-details--switch-btns__btn"
                      onClick={() => {
                        setIsMetaByFile(false);
                        setDroppedMetaFile(null);
                      }}
                    >
                      <img src={isMetaByFile ? deselected : selected} alt="radio" />
                      Manual input
                    </button>
                  </div>
                </div>
              </div>
              <div className="program-details__wrapper-column2">
                {(isMetaByFile && (
                  <div className="program-details__info">
                    <label className="program-details__field" htmlFor="meta">
                      Metadata file:{' '}
                    </label>
                    <Field
                      id="meta"
                      name="meta"
                      className="is-hidden"
                      type="file"
                      innerRef={metaFieldRef}
                      onChange={handleMetaInputChange}
                    />
                    {(droppedMetaFile && (
                      <div className="program-details__filename program-details__value">
                        {droppedMetaFile.name.replace(`.${droppedMetaFile.name.split('.').pop()}`, '')}.
                        {droppedMetaFile.name.split('.').pop()}
                        <button type="button" onClick={removeMetaFile}>
                          <img alt="cancel" src={cancel} />
                        </button>
                      </div>
                    )) || (
                      <button className="program-details--file-btn" type="button" onClick={uploadMetaFile}>
                        Select file
                      </button>
                    )}
                  </div>
                )) || (
                  <>
                    <div className="program-details__info">
                      <label htmlFor="init_input" className="program-details__field-limit program-details__field">
                        Initial type:
                      </label>
                      <div className="program-details__field-wrapper">
                        <Field
                          id="init_input"
                          name="init_input"
                          placeholder=""
                          className="program-details__limit-value program-details__value"
                          type="text"
                        />
                        {errors.init_input && touched.init_input ? (
                          <div className="program-details__error">{errors.init_input}</div>
                        ) : null}
                      </div>
                    </div>
                    <div className="program-details__info">
                      <label htmlFor="input" className="program-details__field-limit program-details__field">
                        Incoming type:
                      </label>
                      <div className="program-details__field-wrapper">
                        <Field
                          id="input"
                          name="input"
                          placeholder=""
                          className="program-details__limit-value program-details__value"
                          type="text"
                        />
                        {errors.input && touched.input ? (
                          <div className="program-details__error">{errors.input}</div>
                        ) : null}
                      </div>
                    </div>
                    <div className="program-details__info">
                      <label
                        htmlFor="output"
                        className="program-details__field-init-value program-details__field"
                      >
                        Expected type:
                      </label>
                      <div className="program-details__field-wrapper">
                        <Field
                          id="output"
                          name="output"
                          placeholder=""
                          className="program-details__init-value program-details__value"
                          type="text"
                        />
                        {errors.output && touched.output ? (
                          <div className="program-details__error">{errors.output}</div>
                        ) : null}
                      </div>
                    </div>
                    <div className="program-details__info">
                      <label htmlFor="init_output" className="program-details__field-init-value program-details__field">
                        Initial output type:
                      </label>
                      <div className="program-details__field-wrapper">
                        <Field
                          id="init_output"
                          name="init_output"
                          placeholder=""
                          className="program-details__init-value program-details__value"
                          type="text"
                        />
                        {errors.init_output && touched.init_output ? (
                          <div className="program-details__error">{errors.init_output}</div>
                        ) : null}
                      </div>
                    </div>
                    <div className="program-details__info">
                      <label
                        htmlFor="types"
                        className="program-details__field-init-value program-details__field"
                      >
                        Types:
                      </label>
                      <div className="program-details__field-wrapper">
                        <Field
                          as="textarea"
                          id="types"
                          name="types"
                          placeholder="{&#10;...&#10;}"
                          className="program-details__types program-details__value"
                        />
                        <p>
                          <a href="#" className="program-details__link" onClick={prettyPrint}>
                            Prettify
                          </a>
                        </p>
                        {errors.types && touched.types ? (
                          <div className="program-details__error">{errors.types}</div>
                        ) : null}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="program-details__buttons">
                <button type="submit" className="program-details__upload" aria-label="uploadProgramm">
                  Upload program
                </button>
                {/* eslint-disable react/button-has-type */}
                <button type="reset" className="program-details__cancel" aria-label="closeProgramDetails">
                  Cancel upload
                </button>
                {/* eslint-enable react/button-has-type */}
              </div>
            </div>
          </Form>
        )}
      </Formik>
      {wrongMetaFormat && (
        <StatusPanel
          onClose={() => {
            setWrongMetaFormat(false);
          }}
          statusPanelText={null}
          isError
        />
      )}
    </div>
  );
};

export default ProgramDetails;
