import styles from './Loader.module.scss';
import LoaderGear1SVG from '../../assets/images/loader/loaderGear1.svg?react';
import LoaderGear2SVG from '../../assets/images/loader/loaderGear2.svg?react';
import LoaderGear3SVG from '../../assets/images/loader/loaderGear3.svg?react';

const Loader = () => (
  <div className={styles.loader}>
    <div className={styles.gears}>
      <LoaderGear1SVG className={styles.gear1} />
      <LoaderGear2SVG className={styles.gear2} />
      <LoaderGear3SVG className={styles.gear3} />
    </div>
    <div className={styles.progress}>
      <div className={styles.loaderLine}>
        <div className={styles.line} />
        <div className={styles.line} />
        <div className={styles.line} />
        <div className={styles.line} />
        <div className={styles.line} />
      </div>
      <span className={styles.text}>Loading...</span>
    </div>
  </div>
);

export { Loader };
