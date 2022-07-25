import { ReactNode, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';

import styles from './Tooltip.module.scss';

type Props = {
  width?: number;
  content: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

const Tooltip = ({ width = 160, content, children, className, contentClassName }: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  const hideTooltip = () => setIsVisible(false);
  const showTooltip = () => setIsVisible(true);

  return (
    <div
      className={clsx(styles.tooltip, className)}
      onBlur={hideTooltip}
      onFocus={showTooltip}
      onMouseOver={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      <CSSTransition in={isVisible} timeout={200} unmountOnExit>
        <div style={{ width }} className={clsx(styles.content, contentClassName)}>
          {content}
        </div>
      </CSSTransition>
    </div>
  );
};

export { Tooltip };
