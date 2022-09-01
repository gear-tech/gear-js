import { ReactNode } from 'react';
import { CSSTransition } from 'react-transition-group';

import styles from './EmptyContent.module.scss';
import { AnimationTimeout } from '../../config';

type Props = {
  title: string;
  children?: ReactNode;
  description: string;
};

const EmptyContent = ({ title, children, description }: Props) => (
  <CSSTransition in appear timeout={AnimationTimeout.Default}>
    <div className={styles.emptyContent}>
      <div className={styles.textContent}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        {children}
      </div>
    </div>
  </CSSTransition>
);

export { EmptyContent };
