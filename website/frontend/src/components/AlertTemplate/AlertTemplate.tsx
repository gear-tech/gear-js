import React, { FC } from 'react';
import { AlertComponentPropsWithStyle } from 'react-alert';
import { AlertCircle, CheckCircle, Info } from 'react-feather';

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

const buttonStyle = {
  marginLeft: '20px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: '#FFFFFF',
};

export const AlertTemplate: FC<AlertComponentPropsWithStyle> = ({ message, options, style, close }) => (
  // @ts-ignore
  <div style={{ ...alertStyle, ...style }}>
    {options.type === 'info' && <Info color="blue" />}
    {options.type === 'success' && <CheckCircle color="green" />}
    {options.type === 'error' && <AlertCircle color="red" />}
    &nbsp;<span style={{ flex: 2 }}>{message}</span>
    <button onClick={close} style={buttonStyle} type="button">
      &times;
    </button>
  </div>
);
