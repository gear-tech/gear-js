import clsx from 'clsx';
import {
  InputHTMLAttributes,
  useRef,
  MouseEvent,
  forwardRef,
  ForwardedRef,
  useImperativeHandle,
  useState,
  ChangeEvent,
} from 'react';
import { Button } from '../Button/Button';
import trashSVG from './images/trash.svg';
import styles from './FileInput.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const FileInput = forwardRef(
  ({ label, className, onChange, ...attrs }: Props, forwardedRef: ForwardedRef<HTMLInputElement>) => {
    const [name, setName] = useState('');
    const ref = useRef<HTMLInputElement>(null);
    const labelClassName = clsx(styles.label, className);

    // TODO: figure out what's wrong
    // @ts-ignore
    useImperativeHandle(forwardedRef, () => ref.current);

    const handleButtonClick = () => {
      ref.current?.click();
    };

    const resetValue = () => {
      if (ref.current) {
        ref.current.value = '';
      }
    };

    const handleRemoveButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (ref.current) {
        resetValue();
        const changeEvent = new Event('change', { bubbles: true });
        ref.current.dispatchEvent(changeEvent);
      }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setName(e.target.files?.[0]?.name || '');

      if (onChange) onChange(e);
    };

    return (
      <label className={labelClassName}>
        {label && <span className={styles.text}>{label}</span>}
        <input type="file" className={styles.input} ref={ref} onChange={handleChange} {...attrs} />
        {name ? (
          <span className={styles.file}>
            <Button text={name} color="transparent" size="small" className={styles.name} onClick={handleButtonClick} />
            <Button icon={trashSVG} color="transparent" onClick={handleRemoveButtonClick} />
          </span>
        ) : (
          <Button text="Select file" color="secondary" size="small" onClick={handleButtonClick} />
        )}
      </label>
    );
  },
);

export { FileInput, Props as FileInputProps, styles as fileInputStyles };
