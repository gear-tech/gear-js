import { ReactNode } from 'react';
import clsx from 'clsx';
import { Gap } from '../../../types';
import styles from './InputWrapper.module.scss';
import { Tooltip } from '../../Tooltip/Tooltip';

type Props = {
  id: string;
  direction: string;
  size: string;
  children: ReactNode;
  className?: string;
  label?: string;
  error?: ReactNode;
  gap?: Gap;
  disabled?: boolean;
  tooltip?: string;
};

const InputWrapper = ({ id, children, className, label, error, direction, size, gap, disabled, tooltip }: Props) => {
  const wrapperClassName = clsx(styles.wrapper, className, disabled && 'disabled', label && styles[direction]);
  const labelWrapperClassName = clsx(styles.labelWrapper, styles[size], styles[direction]);

  const getLabelGap = (gap: Gap) => {
    const [labelColumn, inputColumn] = gap.split('/');
    const gridTemplateColumns = `${labelColumn}fr ${inputColumn}fr`;

    return { gridTemplateColumns };
  };

  return (
    <div className={wrapperClassName} style={gap && getLabelGap(gap)} data-testid="inputWrapper">
      {label && (
        <div className={labelWrapperClassName}>
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
          {tooltip && <Tooltip text={tooltip} className={styles.tooltip} />}
        </div>
      )}
      <div className={styles.errorWrapper}>
        {children}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export { InputWrapper, Props as InputProps, styles as inputStyles };
