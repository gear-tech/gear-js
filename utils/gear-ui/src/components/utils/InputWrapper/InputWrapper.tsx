import { ReactNode } from 'react';
import clsx from 'clsx';
import { Gap } from '../../../types';
import { Tooltip } from '../../Tooltip/Tooltip';
import styles from './InputWrapper.module.scss';

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

const InputWrapper = (props: Props) => {
  const { id, children, className, label, error, direction, size, gap, disabled, tooltip } = props;

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

export { InputWrapper, styles as inputWrapperStyles };
export type { Props as InputWrapperProps };
