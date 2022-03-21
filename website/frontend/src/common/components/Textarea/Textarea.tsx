import React, { TextareaHTMLAttributes } from 'react';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = ({ label }: Props) => {
  return (
    <label>
      {label}
      <textarea />
    </label>
  );
};

export { Textarea };
