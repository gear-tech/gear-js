import { FC } from 'react';
import { ProgressBar } from 'components/ProgressBar/ProgressBar';
import UpGear from 'assets/images/loader/gear_up.svg';
import DownGear from 'assets/images/loader/gear_down.svg';
import styles from './Loader.module.scss';

export const Loader: FC = () => (
  <div className={styles.loader}>
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
);
