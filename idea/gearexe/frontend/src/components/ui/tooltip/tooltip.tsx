import React, { useState, ReactNode } from 'react';
import styles from './tooltip.module.scss';

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
};

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={styles.tooltipWrapper}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && <div className={styles.tooltip}>{content}</div>}
    </div>
  );
};

export { Tooltip };
