import React from 'react';

import { Formik, Form, Field } from 'formik';

import { socketService } from 'consts';
import { UploadProgramModel } from 'types/program';

import './ProgramDetails.scss';

import cancel from 'images/cancel.svg';
import close from 'images/close.svg';

import { Schema } from './Schema';

type ProgramDetailsTypes = {
  setDroppedFile: (file: File | null) => void;
  droppedFile: File;
}

const ProgramDetails = ({setDroppedFile, droppedFile}: ProgramDetailsTypes) => {

  const mapInitialValues = () => ({
    gasLimit: 20000,
    value: 20000,
    initPayload: ""
  })

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
          console.log(values)
          socketService.uploadProgram(droppedFile, values);
       }}
    >
      {({ errors, touched }) => (
        <Form>
          <button
            type="button"
            aria-label="closeButton"
            onClick={() => setDroppedFile(null)}>
            <img 
              src={close} 
              alt="close" 
              className="program-details__close"
            />
          </button>
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
                  <button type="button">
                    <img alt="cancel" src={cancel} />
                  </button>
                </div>
              </div>
              <div className="program-details__info">
                <label htmlFor="gasLimit" className="program-details__field-limit program-details__field">Gas limit:</label>
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
            <div className="program-details__wrapper-column2">
              <div className="program-details__info">
                <label htmlFor="initPayload" className="program-details__field-init-parameters program-details__field">Initial parameters:</label>
                <Field 
                  id="initPayload" 
                  name="initPayload" 
                  className="program-details__init-parameters-value program-details__value"
                />
                {errors.initPayload && touched.initPayload ? <div className="program-details__error">{errors.initPayload}</div> : null}
              </div>

              <div className="program-details__info">
                <label htmlFor="value" className="program-details__field-init-value program-details__field">Initial value:</label>
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

            <div className="program-details__buttons">
              <button 
                type="submit" 
                className="program-details__upload"
                aria-label="uploadProgramm"
                >
                Upload program
              </button>
              <button 
                type="button" 
                className="program-details__cancel"
                aria-label="closeProgramDetails"
                onClick={() => setDroppedFile(null)}
              >
                Cancel upload
              </button>
            </div>
          </div>
        </Form>
      )}
      </Formik>
    </div>
  )
}

export default ProgramDetails;
