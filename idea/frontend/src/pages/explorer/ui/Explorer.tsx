import { Outlet } from 'react-router-dom';

import { Search } from './search';
import styles from './Explorer.module.scss';

const Explorer = () => (
  <section className={styles.explorer}>
    <h2 className={styles.heading}>Recent events</h2>
    <Search />
    <Outlet />
  </section>
);

export { Explorer };
