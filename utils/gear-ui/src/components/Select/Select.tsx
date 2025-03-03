import clsx from 'clsx';
import { OptionHTMLAttributes, useId, ReactNode, ComponentPropsWithRef } from 'react';

import { InputProps } from '../../types';
import { InputWrapper } from '../utils';

import styles from './Select.module.scss';

type Props = Omit<ComponentPropsWithRef<'select'>, 'size'> &
  InputProps &
  (
    | {
        options: OptionHTMLAttributes<HTMLOptionElement>[] | Readonly<OptionHTMLAttributes<HTMLOptionElement>[]>;
      }
    | { children: ReactNode }
  );

const Select = (props: Props) => {
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
    Boolean(error) && styles.error,
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
      <select id={id} className={selectClassName} {...attrs}>
        {getOptions()}
      </select>
    </InputWrapper>
  );
};

// TODO: either fix only-export-components or remove rule
// eslint-disable-next-line react-refresh/only-export-components
export { Select, styles as selectStyles };
export type { Props as SelectProps };
