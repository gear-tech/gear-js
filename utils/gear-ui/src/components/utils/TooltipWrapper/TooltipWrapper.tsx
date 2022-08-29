import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './TooltipWrapper.module.scss';

type Props = {
  text: string;
  children: ReactNode;
  className?: string;
};

const TooltipWrapper = ({ text, children, className }: Props) => {
  const wrapperClassName = clsx(styles.wrapper, className);

  return (
    <div className={wrapperClassName} data-tooltip={text}>
      {children}
    </div>
  );
};

export { TooltipWrapper };
