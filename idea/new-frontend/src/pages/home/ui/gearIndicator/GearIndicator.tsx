import { memo, ReactNode } from 'react';
import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';

import { AnimationTimeout } from 'shared/config';

import styles from './GearIndicator.module.scss';

type Props = {
  icon: ReactNode;
  name: string;
  value: string;
  isLoading?: boolean;
};

const GearIndicator = memo(({ icon, name, value, isLoading = false }: Props) => (
  <CSSTransition in={!isLoading} timeout={AnimationTimeout.Default} exit={false}>
    <article className={clsx(styles.gearIndicator, isLoading && styles.loading)}>
      <p className={styles.textContent}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.value}>{value}</span>
        <span className={styles.name}>{name}</span>
      </p>
    </article>
  </CSSTransition>
));

export { GearIndicator };
