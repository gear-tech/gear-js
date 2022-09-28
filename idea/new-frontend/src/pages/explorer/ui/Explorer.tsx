import { Input } from '@gear-js/ui';
import { Outlet } from 'react-router-dom';

import styles from './Explorer.module.scss';

const Explorer = () => (
  <section className={styles.explorer}>
    <h2 className={styles.heading}>Recent events</h2>
    <Input type="search" placeholder="Search block hash or number to query" className={styles.form} />
    <Outlet />
  </section>
);

export { Explorer };
