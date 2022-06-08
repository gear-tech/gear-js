import { forwardRef, TextareaHTMLAttributes, ForwardedRef } from 'react';
import clsx from 'clsx';
import styles from './Textarea.module.scss';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = forwardRef(
  ({ label, className, rows = 5, ...attrs }: Props, ref: ForwardedRef<HTMLTextAreaElement>) => {
    const { disabled } = attrs;
    const labelClassName = clsx(styles.label, className, disabled && 'disabled');

    return (
      <label className={labelClassName} data-testid="label">
        {label && <span className={styles.text}>{label}</span>}
        <textarea rows={rows} className={styles.textarea} ref={ref} {...attrs} />
      </label>
    );
  },
);

export { Textarea, Props as TextareaProps, styles as textareaStyles };
