import React from 'react';
import { AlertTemplateProps } from 'react-alert';
import { AlertCircle, CheckCircle, Info, X } from 'react-feather';

const alertStyle = {
  backgroundColor: '#151515',
  color: 'white',
  padding: '10px',
  borderRadius: '3px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textAlign: 'center',
  boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.03)',
  width: '100%',
  boxSizing: 'border-box',
};

const textStyle = {
  margin: '0 10px',
};

const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0',
  marginLeft: '5px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: '#FFFFFF',
};

const AlertTemplate = ({ message, options, style, close }: AlertTemplateProps) => (
  // @ts-ignore
  <div style={{ ...alertStyle, ...style }}>
    {options.type === 'info' && <Info color="blue" />}
    {options.type === 'success' && <CheckCircle color="green" />}
    {options.type === 'error' && <AlertCircle color="red" />}
    <span style={textStyle}>{message}</span>
    <button onClick={close} style={buttonStyle} type="button">
      <X size="18" />
    </button>
  </div>
);

export { AlertTemplate };
