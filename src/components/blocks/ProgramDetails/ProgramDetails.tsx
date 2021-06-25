import React from 'react';

import './ProgramDetails.scss';

import cancel from 'images/cancel.svg';

const ProgramDetails = () => (
  <div className="program-details">
    <h3 className="program-details__header">UPLOAD NEW PROGRAM</h3>
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
          <span className="program-details__filename program-details__value">
            awesomeprogramnam...
            <span>.wasm</span>
            <button type="button">
              <img alt="cancel" src={cancel} />
            </button>
          </span>
        </div>
        <div className="program-details__info">
          <span className="program-details__field-limit program-details__field">Gas limit:</span>
          <span className="program-details__limit-value program-details__value">20000</span>
        </div>
      </div>
      <div className="program-details__wrapper-column2">
        <div className="program-details__info">
          <span className="program-details__field-init-parameters program-details__field">Initial parameters:</span>
          <span className="program-details__init-parameters-value program-details__value">20000</span>
        </div>

        <div className="program-details__info">
          <span className="program-details__field-init-value program-details__field">Initial value:</span>
          <span className="program-details__init-value program-details__value">20000</span>
        </div>
      </div>

      <div className="program-details__buttons">
        <button type="button" className="program-details__upload">
          Upload program
        </button>
        <button type="button" className="program-details__cancel">
          Cancel upload
        </button>
      </div>
    </div>
  </div>
);

export default ProgramDetails;
