import React, { useRef } from 'react';

import './ProgramDetails.scss';

import cancel from 'images/cancel.svg';
import close from 'images/close.svg';

const ProgramDetails = () => {

  const programDetailsRef = useRef<HTMLDivElement | null>(null)

  const handleCloseUpload = () => {
    if (programDetailsRef.current) {
      programDetailsRef.current.style.display = "none";
    }
  }

  return (
    <div 
      className="program-details"
      ref={programDetailsRef}
    >
      <h3 className="program-details__header">UPLOAD NEW PROGRAM</h3>
      <button
        type="button"
        aria-label="closeButton"
        onClick={handleCloseUpload}>
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
              awesomeprogramnam...
              <span>.tbd</span>
              <button type="button">
                <img alt="cancel" src={cancel} />
              </button>
            </div>
          </div>
          <div className="program-details__info">
            <span className="program-details__field-limit program-details__field">Gas limit:</span>
            <div className="program-details__limit-value program-details__value">20000</div>
          </div>
        </div>
        <div className="program-details__wrapper-column2">
          <div className="program-details__info">
            <span className="program-details__field-init-parameters program-details__field">Initial parameters:</span>
            <div className="program-details__init-parameters-value program-details__value">20000</div>
          </div>

          <div className="program-details__info">
            <span className="program-details__field-init-value program-details__field">Initial value:</span>
            <div className="program-details__init-value program-details__value">20000</div>
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
  )
};

export default ProgramDetails;
