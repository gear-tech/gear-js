import { OptionHTMLAttributes, SelectHTMLAttributes, forwardRef, ForwardedRef, useId, ReactNode } from 'react';
import clsx from 'clsx';
import { InputProps } from '../../types';
import { InputWrapper } from '../utils';
import styles from './Select.module.scss';

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> &
  InputProps &
  (
    | {
        options: OptionHTMLAttributes<HTMLOptionElement>[];
      }
    | { children: ReactNode }
  );

const Select = forwardRef((props: Props, ref: ForwardedRef<HTMLSelectElement>) => {
  const {
    label,
    className,
    error,
    gap,
    tooltip,
    block,
    color = 'dark',
    size = 'normal',
    direction = 'x',
    ...attrs
  } = props;

  const { disabled } = attrs;

  const selectClassName = clsx(
    styles.select,
    styles[color],
    styles[size],
    error && styles.error,
    block && styles.block,
  );

  const id = useId();

  const getOptions = () =>
    'options' in props ? props.options.map((option, index) => <option key={index} {...option} />) : props.children;

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
      <select id={id} className={selectClassName} ref={ref} {...attrs}>
        {getOptions()}
      </select>
    </InputWrapper>
  );
});

export { Select, styles as selectStyles };
export type { Props as SelectProps };
