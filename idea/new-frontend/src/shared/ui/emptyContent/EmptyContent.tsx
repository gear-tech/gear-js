import { ReactNode } from 'react';
import { CSSTransition } from 'react-transition-group';

import styles from './EmptyContent.module.scss';
import { AnimationTimeout } from '../../config';

type Props = {
  title: string;
  children?: ReactNode;
  isVisible: boolean;
  description?: string;
};

const EmptyContent = ({ title, children, isVisible, description }: Props) => (
  <CSSTransition in={isVisible} timeout={AnimationTimeout.Default} exit={false} mountOnEnter unmountOnExit>
    <div className={styles.emptyContent}>
      <div className={styles.textContent}>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
        {children}
      </div>
    </div>
  </CSSTransition>
);

export { EmptyContent };
