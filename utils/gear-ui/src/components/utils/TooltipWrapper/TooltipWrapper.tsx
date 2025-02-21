import clsx from 'clsx';
import { ReactNode } from 'react';

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

export { TooltipWrapper, styles as TooltipWrapperStyles };
export type { Props as TooltipWrapperProps };
