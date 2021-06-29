import React from 'react';

import './Error.scss';

type ErrorType = {
  onClose: () => void;
  errorText: string | null;
};

const Error = ({ onClose, errorText }: ErrorType) => (
  <div className="error-block">
    <p className="error-block__msg">{errorText || 'Upload error: Incorrect file format'}</p>
    <button className="error-block__close-btn" type="button" onClick={onClose} aria-label="close" />
  </div>
);

export default Error;
