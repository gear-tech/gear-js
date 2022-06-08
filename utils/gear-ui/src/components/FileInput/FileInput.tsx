import { Button } from '../Button/Button';
import clsx from 'clsx';
import {
  InputHTMLAttributes,
  useRef,
  MouseEvent,
  useEffect,
  forwardRef,
  ForwardedRef,
  useImperativeHandle,
} from 'react';
import trashSVG from './images/trash.svg';
import styles from './FileInput.module.scss';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value: File | undefined;
  label?: string;
}

type Ref = ForwardedRef<HTMLInputElement>;

const FileInput = forwardRef(({ label, className, value, ...attrs }: Props, forwardedRef: Ref) => {
  const ref = useRef<HTMLInputElement>(null);
  const labelClassName = clsx(styles.label, className);

  // TODO: figure out what's wrong
  // @ts-ignore
  useImperativeHandle(forwardedRef, () => ref.current);

  const handleButtonClick = () => {
    ref.current?.click();
  };

  const resetValue = () => {
    if (ref.current) ref.current.value = '';
  };

  const handleRemoveButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (ref.current) {
      resetValue();
      const changeEvent = new Event('change', { bubbles: true });
      ref.current.dispatchEvent(changeEvent);
    }
  };

  useEffect(() => {
    if (!value) resetValue();
  }, [value]);

  return (
    <label className={labelClassName}>
      {label && <span className={styles.text}>{label}</span>}
      <input type="file" className={styles.input} ref={ref} {...attrs} />
      {value ? (
        <span className={styles.file}>
          <Button
            text={value.name}
            color="transparent"
            size="small"
            className={styles.name}
            onClick={handleButtonClick}
          />
          <Button icon={trashSVG} color="transparent" onClick={handleRemoveButtonClick} />
        </span>
      ) : (
        <Button text="Select file" color="secondary" size="small" onClick={handleButtonClick} />
      )}
    </label>
  );
});

export { FileInput, Props as FileInputProps, styles as fileInputStyles };
