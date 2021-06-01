import React from 'react';

import './Error.scss';

const Error = () => {
  return (
    <div className="error-block">
      <p className="error-block__msg">Upload error: Incorrect file format</p>
      <button  className="error-block__close-btn" type="button"/>
    </div>
  );
};

export default Error;