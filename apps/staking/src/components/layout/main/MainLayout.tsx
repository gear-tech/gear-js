import { Outlet } from 'react-router-dom';

import { ReactComponent as CubeSVG } from 'assets/images/cube.svg';

import styles from './MainLayout.module.scss';

function MainLayout() {
  return (
    <>
      <h1 className={styles.heading}>Stacking</h1>
      <div className={styles.content}>
        <div className={styles.cubeWrapper}>
          <CubeSVG />
        </div>
        <div className={styles.outlet}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export { MainLayout };
