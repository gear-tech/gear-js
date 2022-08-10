import { Outlet } from 'react-router-dom';

import styles from './MainPageLayout.module.scss';
import { Navigation } from './children/Navigation';

const MainPageLayout = () => (
  <div className={styles.main}>
    <Navigation />
    <Outlet />
  </div>
);

export { MainPageLayout };
