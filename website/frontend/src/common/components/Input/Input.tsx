import React, { InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = ({ label, ...attrs }: Props) => {
  return (
    <label>
      {label}
      <input type="text" {...attrs} />
    </label>
  );
};

export { Input };
