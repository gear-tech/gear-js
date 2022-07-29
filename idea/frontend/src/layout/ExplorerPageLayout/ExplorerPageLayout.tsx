import { Outlet } from 'react-router-dom';

import styles from './ExplorerPageLayout.module.scss';
import { Search } from './children/Search';

import { BackButton } from 'components/BackButton/BackButton';
import { BlocksSummary } from 'components/BlocksSummary/BlocksSummary';

const ExplorerPageLayout = () => (
  <div className={styles.explorer}>
    <header className={styles.header}>
      <div className={styles.search}>
        <BackButton />
        <Search />
      </div>
      <BlocksSummary />
    </header>
    <Outlet />
  </div>
);

export { ExplorerPageLayout };
