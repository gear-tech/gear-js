import { Outlet } from 'react-router-dom';

import { ExplorerSearch } from '@/features/explorer';

import styles from './explorer.module.scss';

const Explorer = () => (
  <section className={styles.explorer}>
    <h2 className={styles.heading}>Recent events</h2>

    <ExplorerSearch />

    <Outlet />
  </section>
);

export { Explorer };
