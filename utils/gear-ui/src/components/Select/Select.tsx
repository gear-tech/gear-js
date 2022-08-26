import { OptionHTMLAttributes, SelectHTMLAttributes, forwardRef, ForwardedRef, ReactNode, useId } from 'react';
import clsx from 'clsx';
import { Gap } from '../../types';
import { getLabelGap } from '../../utils';
import styles from './Select.module.scss';

type BaseProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  options: OptionHTMLAttributes<HTMLOptionElement>[];
  size?: 'normal' | 'large';
  color?: 'light' | 'dark';
  error?: ReactNode;
};

type XDirectionProps = BaseProps & { label?: string; direction?: 'x'; gap?: Gap };
type YDirectionProps = BaseProps & { label?: string; direction?: 'y'; gap?: never };

type Props = XDirectionProps | YDirectionProps;

const Select = forwardRef((props: Props, ref: ForwardedRef<HTMLSelectElement>) => {
  const { options, label, className, error, gap, color = 'dark', size = 'normal', direction = 'x', ...attrs } = props;
  const { disabled } = attrs;

  const wrapperClassName = clsx(styles.wrapper, className, disabled && 'disabled', label && styles[direction]);
  const labelClassName = clsx(styles.label, styles[size], styles[direction]);
  const selectClassName = clsx(styles.select, styles[color], styles[size], error && styles.error);

  const id = useId();

  const getOptions = () => options.map((option, index) => <option key={index} {...option} />);

  return (
    <div className={wrapperClassName} style={gap && getLabelGap(gap)} data-testid="label">
      {label && (
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
      )}
      <div>
        <select id={id} className={selectClassName} ref={ref} {...attrs}>
          {getOptions()}
        </select>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
});

export { Select, Props as SelectProps, styles as selectStyles };
