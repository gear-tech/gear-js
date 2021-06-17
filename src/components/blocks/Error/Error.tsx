import React from 'react';

import './Error.scss';

type ErrorType = {
  onClose: () => void;
};

const Error = ({ onClose }: ErrorType) => (
  <div className="error-block">
    <p className="error-block__msg">Upload error: Incorrect file format</p>
    <button className="error-block__close-btn" type="button" onClick={onClose} aria-label="close" />
  </div>
);

export default Error;
