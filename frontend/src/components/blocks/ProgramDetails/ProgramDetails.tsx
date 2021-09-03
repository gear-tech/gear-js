import React, { useState, useCallback, useRef } from 'react';

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

type ProgramDetailsTypes = {
  setDroppedFile: (file: File | null) => void;
  droppedFile: File;
  socketService: SocketService;  
}

const ProgramDetails = ({setDroppedFile, droppedFile, socketService}: ProgramDetailsTypes) => {

  const dispatch = useDispatch();

  const [isMetaByFile, setIsMetaByFile] = useState(false);
  const [droppedMetaFile, setDroppedMetaFile] = useState<File | null>(null);
  const [wrongMetaFormat, setWrongMetaFormat] = useState(false);

  const metaFieldRef = useRef<any>(null);


  if ( wrongMetaFormat ) {
    setTimeout( () => setWrongMetaFormat(false), 3000);
  }

  const mapInitialValues = () => ({
    gasLimit: 0,
    value: 20000,
    initPayload: "",
    initType: "",
    incomingType: "",
    expectedType: "",
    initOutType: "",
    meta: null
  })

  const removeMetaFile = () => {
    setDroppedMetaFile(null);
  }

  const uploadMetaFile = () => {
    metaFieldRef.current?.click();
  }

  const handleFilesUpload = useCallback((file) => {
    setDroppedMetaFile(file)
  }, [setDroppedMetaFile])

  const checkFileFormat = useCallback((files: any) => {
    // eslint-disable-next-line no-console
    if ( typeof files[0]?.name === 'string' ) {
      const fileExt: string = files[0].name.split(".").pop().toLowerCase();
      return fileExt !== 'wasm';
    }
    return true
  }, [])

  const handleMetaInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { files } } = event;
    if ( files?.length ) {
      const isCorrectFormat = checkFileFormat(files);
      setWrongMetaFormat(isCorrectFormat);
      if (!isCorrectFormat) {
        handleFilesUpload(files[0])
      }
    }
  };

  return (
  
    <div 
      className="program-details"
    >
      <h3 className="program-details__header">UPLOAD NEW PROGRAM</h3>
      <Formik
        initialValues={mapInitialValues()}
        validationSchema={Schema}
        validateOnBlur
        onSubmit={(
          values: UploadProgramModel,
        ) => {
          dispatch(programUploadStartAction())
          socketService.uploadProgram(droppedFile, {...values, meta: droppedMetaFile});
          setDroppedFile(null)
       }}
       onReset={() => {
         setDroppedFile(null)
       }}
    >
      {({ errors, touched }) => (
        <Form>
          {/* eslint-disable react/button-has-type */}
          <button
            type="reset"
            aria-label="closeButton"
          >
            <img 
              src={close} 
              alt="close" 
              className="program-details__close"
            />
          </button>
          {/* eslint-disable react/button-has-type */}
          <div className="program-details__download">
            <progress className="program-details__progress" max="100" value="65"/>
            <div className="program-details__progress-value"/>
            <div className="program-details__progress-bg">
              <div className="program-details__progress-bar"/>
            </div>
          </div>
          <div className="program-details__wrapper">
            <div className="program-details__wrapper-column1">
              <div className="program-details__info">
                <span className="program-details__field-file program-details__field">File:</span>
                <div className="program-details__filename program-details__value">
                  {droppedFile.name.replace(`.${droppedFile.name.split('.').pop()}`, "")}.{droppedFile.name.split('.').pop()}
                  <button type="reset">
                    <img alt="cancel" src={cancel} />
                  </button>
                </div>
              </div>
              <div className="program-details__info">
                <label htmlFor="gasLimit" className="program-details__field-limit program-details__field">Gas limit:</label>
                <div className="program-details__field-wrapper">
                  <Field 
                    id="gasLimit" 
                    name="gasLimit" 
                    placeholder="20000" 
                    className="program-details__limit-value program-details__value" 
                    type="number"
                  />
                  {errors.gasLimit && touched.gasLimit ? <div className="program-details__error">{errors.gasLimit}</div> : null}
                </div>
              </div>
              <div className="program-details__info">
                <label htmlFor="initPayload" className="program-details__field-init-parameters program-details__field">Initial parameters:</label>
                <div className="program-details__field-wrapper">
                  <Field 
                    id="initPayload" 
                    name="initPayload" 
                    className="program-details__init-parameters-value program-details__value"
                  />
                  {errors.initPayload && touched.initPayload ? <div className="program-details__error">{errors.initPayload}</div> : null}
                </div>
              </div>

              <div className="program-details__info">
                <label htmlFor="value" className="program-details__field-init-value program-details__field">Initial value:</label>
                <div className="program-details__field-wrapper">
                  <Field 
                    id="value" 
                    name="value" 
                    placeholder="20000" 
                    className="program-details__init-value program-details__value" 
                    type="number"
                  />
                  {errors.value && touched.value ? <div className="program-details__error">{errors.value}</div> : null}
                </div>
              </div>
              <div className="program-details__info">
                <p className="program-details__field">Metadata: </p>
                <div className="program-details--switch-btns">
                  <button type="button" className="program-details--switch-btns__btn" onClick={() => {
                    setIsMetaByFile(false);
                    setDroppedMetaFile(null);
                  }}>
                    <img src={isMetaByFile ? deselected : selected} alt="radio" />
                    Manual input
                  </button>
                  <button type="button" className="program-details--switch-btns__btn" onClick={() => setIsMetaByFile(true)}>
                    <img src={isMetaByFile ? selected : deselected} alt="radio" />
                    Upload file
                  </button>
                </div>
              </div>
            </div>
            <div className="program-details__wrapper-column2">
              {
                isMetaByFile
                &&
                <div className="program-details__info">
                  <label className="program-details__field" htmlFor="meta">Metadata file: </label>
                  <Field 
                    id="meta" 
                    name="meta" 
                    className="is-hidden" 
                    type="file"
                    innerRef={metaFieldRef}
                    onChange={handleMetaInputChange}
                  />
                  {
                    droppedMetaFile
                    &&
                    <div className="program-details__filename program-details__value">
                      {droppedMetaFile.name.replace(`.${droppedMetaFile.name.split('.').pop()}`, "")}.{droppedMetaFile.name.split('.').pop()}
                      <button type="button" onClick={removeMetaFile}>
                        <img alt="cancel" src={cancel} />
                      </button>
                    </div>
                    ||
                    <button className="program-details--file-btn" type="button" onClick={uploadMetaFile}>
                      Select file
                    </button>
                  }
                </div>
                ||
                <>
                <div className="program-details__info">
                  <label htmlFor="initType" className="program-details__field-limit program-details__field">Initial type:</label>
                  <div className="program-details__field-wrapper">
                    <Field 
                      id="initType" 
                      name="initType" 
                      placeholder="" 
                      className="program-details__limit-value program-details__value" 
                      type="text"
                    />
                    {errors.initType && touched.initType ? <div className="program-details__error">{errors.initType}</div> : null}
                  </div>
                </div>
                <div className="program-details__info">
                  <label htmlFor="incomingType" className="program-details__field-limit program-details__field">Incoming type:</label>
                  <div className="program-details__field-wrapper">
                    <Field 
                      id="incomingType" 
                      name="incomingType" 
                      placeholder="" 
                      className="program-details__limit-value program-details__value" 
                      type="text"
                    />
                    {errors.incomingType && touched.incomingType ? <div className="program-details__error">{errors.incomingType}</div> : null}
                  </div>
                </div>
                <div className="program-details__info">
                  <label htmlFor="expectedType" className="program-details__field-init-value program-details__field">Expected type:</label>
                  <div className="program-details__field-wrapper">
                    <Field 
                      id="expectedType" 
                      name="expectedType" 
                      placeholder="" 
                      className="program-details__init-value program-details__value" 
                      type="text"
                    />
                    {errors.expectedType && touched.expectedType ? <div className="program-details__error">{errors.expectedType}</div> : null}
                  </div>
                </div>
                <div className="program-details__info">
                  <label htmlFor="initOutType" className="program-details__field-init-value program-details__field">Initial output type:</label>
                  <div className="program-details__field-wrapper">
                    <Field 
                      id="initOutType" 
                      name="initOutType" 
                      placeholder="" 
                      className="program-details__init-value program-details__value" 
                      type="text"
                    />
                    {errors.initOutType && touched.initOutType ? <div className="program-details__error">{errors.initOutType}</div> : null}
                  </div>
                </div>
                </>
              }
            </div>
            <div className="program-details__buttons">
              <button 
                type="submit" 
                className="program-details__upload"
                aria-label="uploadProgramm"
                >
                Upload program
              </button>
              {/* eslint-disable react/button-has-type */}
              <button 
                type="reset"
                className="program-details__cancel"
                aria-label="closeProgramDetails"
              >
                Cancel upload
              </button>
              {/* eslint-enable react/button-has-type */}
            </div>
          </div>
        </Form>
      )}
      </Formik>
      {(wrongMetaFormat) && <StatusPanel onClose={() => {
        setWrongMetaFormat(false);
      }} statusPanelText={null} isError/>}
    </div>
  )
}

export default ProgramDetails;
