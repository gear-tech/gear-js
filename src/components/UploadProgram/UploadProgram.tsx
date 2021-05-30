import React from 'react';

import './UploadProgram.scss';

const UploadProgram = () => {
  return (
    <div className="drop-block">
      <button className="drop-block__button" type="button">Upload program</button>
      <div className="drop-block__info">
        Click “Upload program” to browse or
        drag and drop your .TBD files here
      </div>
    </div>
  );
}

export default UploadProgram;