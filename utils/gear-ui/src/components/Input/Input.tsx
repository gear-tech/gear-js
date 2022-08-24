import {
  InputHTMLAttributes,
  forwardRef,
  ForwardedRef,
  useState,
  MouseEvent,
  useRef,
  useImperativeHandle,
} from 'react';
import clsx from 'clsx';
import { Button } from '../Button/Button';
import clear from './images/clear.svg';
import styles from './Input.module.scss';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: string;
};

const Input = forwardRef(
  ({ label, icon, className, ...attrs }: Props, forwardedRef: ForwardedRef<HTMLInputElement>) => {
    const { readOnly, disabled } = attrs;
    const labelClassName = clsx(styles.label, disabled && 'disabled', className);
    const wrapperClassName = clsx(styles.wrapper, readOnly && styles.readOnly);

    const ref = useRef<HTMLInputElement>(null);

    // TODO: figure out what's wrong
    // @ts-ignore
    useImperativeHandle(forwardedRef, () => ref.current);

    const [isClearButtonVisible, setIsClearButtonVisible] = useState(false);
    const showClearButton = () => setIsClearButtonVisible(true);
    const hideClearButton = () => setIsClearButtonVisible(false);

    const resetValue = () => {
      if (ref.current) {
        ref.current.value = '';
      }
    };

    const handleClearButtonClick = () => {
      if (ref.current) {
        resetValue();
        const changeEvent = new Event('change', { bubbles: true });
        ref.current.dispatchEvent(changeEvent);
      }
    };

    const preventInputBlur = (e: MouseEvent<HTMLButtonElement>) => e.preventDefault();

    return (
      <label className={labelClassName} data-testid="label">
        {label && <span className={styles.text}>{label}</span>}
        <div className={wrapperClassName} data-testid="wrapper">
          {icon && <img src={icon} alt="input icon" className={styles.icon} />}
          <input
            className={styles.input}
            ref={ref}
            {...attrs}
            onFocus={readOnly ? undefined : showClearButton}
            onBlur={hideClearButton}
          />
          {isClearButtonVisible && (
            <Button
              icon={clear}
              color="transparent"
              onClick={handleClearButtonClick}
              onMouseDown={preventInputBlur}
              className={styles.clearButton}
            />
          )}
        </div>
      </label>
    );
  },
);

export { Input, Props as InputProps, styles as inputStyles };
