import React, { FC } from 'react';
import { ProgressBar } from 'components/ProgressBar/ProgressBar';
import { Main } from 'common/components/Main/Main';
import UpGear from 'assets/images/gear_up.svg';
import DownGear from 'assets/images/gear_down.svg';
import styles from './ApiLoader.module.scss';

export const ApiLoader: FC = () => (
  <Main color="#232323">
    <div className={styles.apiLoader}>
      <div className={styles.overlayTop} />
      <div className={styles.overlayBottom} />
      <div className={styles.images}>
        <img className={styles.image} src={UpGear} alt="gear" />
        <img className={styles.image} src={DownGear} alt="gear" />
      </div>
      <div className={styles.block}>
        <ProgressBar status="START" />
        <span className={styles.text}>Loading ...</span>
      </div>
    </div>
  </Main>
);
