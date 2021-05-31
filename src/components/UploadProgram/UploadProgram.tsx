import React from 'react';

import ProgramDetails from '../ProgramDetails';

import './UploadProgram.scss';

const UploadProgram = () => {

  return (
    <>
      <div className="drop-block">
        <button className="drop-block__button" type="button">Upload program</button>
          <div className="drop-block__info">
            Click “Upload program” to browse or
            drag and drop your .TBD files here
          </div>
      </div>
      <ProgramDetails/>
    </>
  );
}

export default UploadProgram;