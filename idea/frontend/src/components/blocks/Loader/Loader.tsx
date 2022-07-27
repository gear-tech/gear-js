import styles from './Loader.module.scss';

import UpGear from 'assets/images/loader/gear_up.svg';
import DownGear from 'assets/images/loader/gear_down.svg';
import { ProgressBar } from 'components/ProgressBar/ProgressBar';

const Loader = () => (
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

export { Loader };
