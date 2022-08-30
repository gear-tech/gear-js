import { ReactNode } from 'react';

import styles from './GearIndicator.module.scss';

type Props = {
  icon: ReactNode;
  name: string;
  value: string;
};

const GearIndicator = ({ icon, name, value }: Props) => (
  <article className={styles.gearIndicator}>
    <p className={styles.textContent}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.value}>{value}</span>
      <span className={styles.name}>{name}</span>
    </p>
  </article>
);

export { GearIndicator };
