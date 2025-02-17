import { ReactNode } from 'react';

import { CSSTransitionWithRef } from '../css-transition-with-ref';
import { AnimationTimeout } from '../../config';
import styles from './EmptyContent.module.scss';

type Props = {
  title?: string;
  children?: ReactNode;
  isVisible: boolean;
  description?: string;
};

const EmptyContent = ({ title, children, isVisible, description }: Props) => (
  <CSSTransitionWithRef in={isVisible} timeout={AnimationTimeout.Default} exit={false} mountOnEnter unmountOnExit>
    <div className={styles.emptyContent}>
      <div className={styles.textContent}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {description && <p className={styles.description}>{description}</p>}
        {children}
      </div>
    </div>
  </CSSTransitionWithRef>
);

export { EmptyContent };
