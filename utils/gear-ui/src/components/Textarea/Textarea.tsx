import { TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Textarea.module.scss';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = ({ label, className, rows = 5, ...attrs }: TextareaProps) => {
  const { disabled } = attrs;
  const labelClassName = clsx(styles.label, className, disabled && 'disabled');

  return (
    <label className={labelClassName} data-testid="label">
      {label && <span className={styles.text}>{label}</span>}
      <textarea rows={rows} className={styles.textarea} {...attrs} />
    </label>
  );
};

export { Textarea, TextareaProps };
