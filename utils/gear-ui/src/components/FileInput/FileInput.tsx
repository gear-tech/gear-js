import {
  useRef,
  MouseEvent,
  forwardRef,
  ForwardedRef,
  useImperativeHandle,
  useState,
  ChangeEvent,
  useId,
  InputHTMLAttributes,
} from 'react';
import { InputProps } from '../../types';
import { getFileSize } from '../../utils';
import { Button } from '../Button/Button';
import { InputWrapper } from '../utils';
import remove from './images/remove.svg';
import select from './images/select.svg';
import styles from './FileInput.module.scss';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  Omit<InputProps, 'color'> & {
    label?: string;
    error?: string;
  };

const FileInput = forwardRef((props: Props, forwardedRef: ForwardedRef<HTMLInputElement>) => {
  const { label, className, gap, error, tooltip, onChange, direction = 'x', size = 'normal', ...attrs } = props;
  const { disabled } = attrs;

  const [name, setName] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  // TODO: figure out what's wrong
  // @ts-ignore
  useImperativeHandle(forwardedRef, () => ref.current);
  const id = useId();

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
    <InputWrapper
      id={id}
      className={className}
      label={label}
      error={error}
      direction={direction}
      size={size}
      gap={gap}
      disabled={disabled}
      tooltip={tooltip}>
      <input id={id} type="file" className={styles.input} ref={ref} onChange={handleChange} {...attrs} />
      {name ? (
        <>
          <div className={styles.file}>
            <Button text={name} color="transparent" size="small" className={styles.name} onClick={handleButtonClick} />
            <Button icon={remove} color="transparent" onClick={handleRemoveButtonClick} />
          </div>
          {!error && <span className={styles.size}>Size: {getFileSize(ref.current?.files?.[0].size as number)}</span>}
        </>
      ) : (
        <Button
          text="Select file"
          icon={select}
          color="light"
          size={size === 'normal' ? 'medium' : 'large'}
          onClick={handleButtonClick}
        />
      )}
    </InputWrapper>
  );
});

export { FileInput, styles as fileInputStyles };
export type { Props as FileInputProps };
