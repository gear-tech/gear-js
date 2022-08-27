import { ReactNode } from 'react';
import { CSSTransition } from 'react-transition-group';

import styles from './EmptyContent.module.scss';
import { ANIMATION_TIMEOUT } from '../../config';

type Props = {
  title: string;
  children?: ReactNode;
  description: string;
};

const EmptyContent = ({ title, children, description }: Props) => (
  <CSSTransition in appear timeout={ANIMATION_TIMEOUT}>
    <div className={styles.emptyContent}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {children}
    </div>
  </CSSTransition>
);

export { EmptyContent };
