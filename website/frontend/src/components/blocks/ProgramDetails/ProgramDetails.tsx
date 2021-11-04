import React, { useState, useCallback, useRef, VFC } from 'react';
import { getWasmMetadata, parseHexTypes } from '@gear-js/api';
import { Formik, Form, Field } from 'formik';
import { UploadProgramModel } from 'types/program';
import { useDispatch } from 'react-redux';
import { UploadProgram } from 'services/ApiService';
import { EventTypes } from 'types/events';
import { AddAlert, programUploadStartAction } from 'store/actions/actions';
import { StatusPanel } from 'components/blocks/StatusPanel/StatusPanel';
import './ProgramDetails.scss';
import cancel from 'assets/images/cancel.svg';
import close from 'assets/images/close.svg';
import deselected from 'assets/images/radio-deselected.svg';
import selected from 'assets/images/radio-selected.svg';
import { Schema } from './Schema';
import { readFileAsync } from '../../../helpers';
import { useApi } from '../../../hooks/useApi';

type Props = {
  setDroppedFile: (file: File | null) => void;
  droppedFile: File;
};

export const ProgramDetails: VFC<Props> = ({ setDroppedFile, droppedFile }) => {
  const dispatch = useDispatch();

  const [isMetaByFile, setIsMetaByFile] = useState(true);
  const [metaWasm, setMetaWasm] = useState<any>(null);
  const [displayTypes, setDisplayTypes] = useState<any>(null);
  const [droppedMetaFile, setDroppedMetaFile] = useState<File | null>(null);
  const [wrongMetaFormat, setWrongMetaFormat] = useState(false);
  const [wrongJSON, setWrongJSON] = useState(false);

  const [api] = useApi();

  const program = {
    gasLimit: 20000,
    value: 0,
    initPayload: '',
    init_input: '',
    init_output: '',
    input: '',
    output: '',
    types: '',
  };

  const metaFieldRef = useRef<any>(null);

  if (wrongMetaFormat) {
    setTimeout(() => setWrongMetaFormat(false), 3000);
  }

  const removeMetaFile = () => {
    setDroppedMetaFile(null);
    setMetaWasm(null);
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
        let types = '';
        const parsedTypes = parseHexTypes(meta.types || '');
        Object.entries(parsedTypes).forEach((value) => {
          types += `${value[0]}: ${JSON.stringify(value[1])}\n`;
        });
        setDisplayTypes(types.trimEnd());
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
      } else {
        dispatch(AddAlert({ type: EventTypes.ERROR, message: 'Wrong file format' }));
        setWrongMetaFormat(false);
      }
    }
  };

  // const prettyPrint = () => {
  //   const ugly = (document.getElementById('types') as HTMLInputElement).value;
  //   const obj = JSON.parse(ugly);
  //   const pretty = JSON.stringify(obj, undefined, 4);
  //   (document.getElementById('types') as HTMLInputElement).innerText = pretty;
  // };

  return (
    <div className="program-details">
      <h3 className="program-details__header">UPLOAD NEW PROGRAM</h3>
      <Formik
        initialValues={program}
        validationSchema={Schema}
        validateOnBlur
        onSubmit={(values: UploadProgramModel) => {
          if (isMetaByFile) {
            dispatch(programUploadStartAction());
            UploadProgram(api, droppedFile, { ...values, ...metaWasm }, dispatch);
            setDroppedFile(null);
          } else {
            try {
              const types = values.types.length > 0 ? JSON.parse(values.types) : values.types;
              dispatch(programUploadStartAction());
              UploadProgram(api, droppedFile, { ...values, types }, dispatch);
              setDroppedFile(null);
            } catch (err) {
              setWrongJSON(true);
              console.log(err);
            }
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
                  <>
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
                    {metaWasm && (
                      <div>
                        <div className="program-details__info">
                          <label htmlFor="init_input" className="program-details__field-limit program-details__field">
                            Initial type:
                          </label>
                          <div className="program-details__field-wrapper">
                            <Field
                              id="init_input"
                              name="init_input"
                              placeholder={JSON.stringify(metaWasm.init_input)}
                              className="program-details__limit-value program-details__value"
                              type="text"
                              disabled="true"
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
                              placeholder={JSON.stringify(metaWasm.handle_input)}
                              className="program-details__limit-value program-details__value"
                              type="text"
                              disabled="true"
                            />
                            {errors.input && touched.input ? (
                              <div className="program-details__error">{errors.input}</div>
                            ) : null}
                          </div>
                        </div>
                        <div className="program-details__info">
                          <label htmlFor="output" className="program-details__field-init-value program-details__field">
                            Expected type:
                          </label>
                          <div className="program-details__field-wrapper">
                            <Field
                              id="output"
                              name="output"
                              placeholder={JSON.stringify(metaWasm.handle_output)}
                              className="program-details__init-value program-details__value"
                              type="text"
                              disabled="true"
                            />
                            {errors.output && touched.output ? (
                              <div className="program-details__error">{errors.output}</div>
                            ) : null}
                          </div>
                        </div>
                        <div className="program-details__info">
                          <label
                            htmlFor="init_output"
                            className="program-details__field-init-value program-details__field"
                          >
                            Initial output type:
                          </label>
                          <div className="program-details__field-wrapper">
                            <Field
                              id="init_output"
                              name="init_output"
                              placeholder={JSON.stringify(metaWasm.init_output)}
                              className="program-details__init-value program-details__value"
                              type="text"
                              disabled="true"
                            />
                            {errors.init_output && touched.init_output ? (
                              <div className="program-details__error">{errors.init_output}</div>
                            ) : null}
                          </div>
                        </div>
                        <div className="program-details__info">
                          <label htmlFor="types" className="program-details__field-init-value program-details__field">
                            Types:
                          </label>
                          <div className="program-details__field-wrapper">
                            <Field
                              as="textarea"
                              id="types"
                              name="types"
                              disabled="true"
                              placeholder={displayTypes}
                              className="program-details__types program-details__value"
                            />
                            {errors.types && touched.types ? (
                              <div className="program-details__error">{errors.types}</div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
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
                      <label htmlFor="output" className="program-details__field-init-value program-details__field">
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
                      <label htmlFor="types" className="program-details__field-init-value program-details__field">
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
      {wrongJSON && (
        <StatusPanel
          onClose={() => {
            setWrongJSON(false);
          }}
          statusPanelText="Invalid JSON format"
          isError
        />
      )}
    </div>
  );
};
