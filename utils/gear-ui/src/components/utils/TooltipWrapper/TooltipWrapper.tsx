import { clsx } from 'clsx';
import type { ReactNode } from 'react';

import styles from './TooltipWrapper.module.scss';

type Props = {
  text: string;
  children: ReactNode;
  className?: string;
};

const TooltipWrapper = ({ text, children, className }: Props) => {
  const wrapperClassName = clsx(styles.wrapper, className);

  return (
    <div className={wrapperClassName} data-tooltip={text} data-testid="tooltipWrapper">
      {children}
    </div>
  );
};

export type { Props as TooltipWrapperProps };
export { styles as TooltipWrapperStyles, TooltipWrapper };
