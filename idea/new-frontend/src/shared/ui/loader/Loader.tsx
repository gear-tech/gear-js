import upGearSVG from 'shared/assets/images/logos/gearUp.svg';
import downGearSVG from 'shared/assets/images/logos/gearDown.svg';

import styles from './Loader.module.scss';

const Loader = () => (
  <div className={styles.loader}>
    <div className={styles.overlayTop} />
    <div className={styles.overlayBottom} />
    <div className={styles.images}>
      <img className={styles.upGear} src={upGearSVG} alt="gear" />
      <img className={styles.downGear} src={downGearSVG} alt="gear" />
    </div>
    <div className={styles.block}>
      <div className={styles.progressBar}>
        <div className={styles.indicator} />
      </div>
      <span className={styles.text}>Loading...</span>
    </div>
  </div>
);

export { Loader };
