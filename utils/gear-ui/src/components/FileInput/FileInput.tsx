import { Button } from '@gear-js/ui';
import clsx from 'clsx';
import { InputHTMLAttributes, useRef, MouseEvent } from 'react';
import trashSVG from 'assets/images/trash.svg';
import styles from './FileInput.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  file?: File | undefined;
}

function FileInput({ label, className, file, ...attrs }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const labelClassName = clsx(styles.label, className);

  const handleRemoveButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (ref.current) {
      ref.current.value = '';
      const changeEvent = new Event('change', { bubbles: true });
      ref.current.dispatchEvent(changeEvent);
    }
  };

  return (
    <label className={labelClassName}>
      {label && <span className={styles.text}>{label}</span>}
      <input type="file" className={styles.input} ref={ref} {...attrs} />
      {file ? (
        <div className={styles.file}>
          <Button text={file.name} color="transparent" size="small" className={styles.name} />
          <Button icon={trashSVG} color="transparent" onClick={handleRemoveButtonClick} />
        </div>
      ) : (
        <Button text="Select file" color="secondary" />
      )}
    </label>
  );
}

export { FileInput };
