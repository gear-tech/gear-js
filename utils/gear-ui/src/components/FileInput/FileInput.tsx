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
import { Button, ButtonProps } from '../Button/Button';
import { InputWrapper } from '../utils';
import { ReactComponent as RemoveSVG } from './images/remove.svg';
import { ReactComponent as SelectSVG } from './images/select.svg';
import styles from './FileInput.module.scss';
import { useChangeEffect } from 'hooks';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange' | 'accept'> &
  Omit<InputProps, 'color'> & {
    value?: File | undefined;
    label?: string;
    error?: string;
    color?: ButtonProps['color'];
    accept?: string | string[];
    onChange?: (value: File | undefined) => void;
  };

const FileInput = forwardRef((props: Props, forwardedRef: ForwardedRef<HTMLInputElement>) => {
  const {
    value,
    label,
    className,
    gap,
    error,
    tooltip,
    accept,
    onChange,
    direction = 'x',
    size = 'normal',
    color = 'light',
    ...attrs
  } = props;

  const { disabled } = attrs;

  const [innerValue, setInnerValue] = useState<File>();

  const file = value || innerValue;
  const setFile = onChange || setInnerValue;

  const ref = useRef<HTMLInputElement>(null);
  const id = useId();

  const acceptValue = Array.isArray(accept) ? accept.join(',') : accept;

  // TODO: figure out what's wrong
  // @ts-ignore
  useImperativeHandle(forwardedRef, () => ref.current);

  const handleButtonClick = () => ref.current?.click();

  const reset = () => {
    if (!ref.current) return;

    ref.current.value = '';

    const changeEvent = new Event('change', { bubbles: true });
    ref.current.dispatchEvent(changeEvent);
  };

  const handleRemoveButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    reset();
  };

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => setFile(target.files?.[0]);

  useChangeEffect(() => {
    if (!value) reset();
  }, [value]);

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
      <input
        id={id}
        type="file"
        className={styles.input}
        ref={ref}
        accept={acceptValue}
        onChange={handleChange}
        {...attrs}
      />
      {file ? (
        <>
          <div className={styles.file}>
            <Button
              text={file.name}
              color="transparent"
              size="small"
              className={styles.name}
              onClick={handleButtonClick}
            />
            <Button icon={RemoveSVG} color="transparent" onClick={handleRemoveButtonClick} />
          </div>

          {!error && <span className={styles.size}>Size: {getFileSize(file.size)}</span>}
        </>
      ) : (
        <Button
          text="Select file"
          icon={SelectSVG}
          color={color}
          size={size === 'normal' ? 'medium' : 'large'}
          onClick={handleButtonClick}
        />
      )}
    </InputWrapper>
  );
});

export { FileInput, styles as fileInputStyles };
export type { Props as FileInputProps };
