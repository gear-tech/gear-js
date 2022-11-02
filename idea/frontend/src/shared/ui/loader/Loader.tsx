import styles from './Loader.module.scss';
import { ReactComponent as LoaderGear1SVG } from '../../assets/images/loader/loaderGear1.svg';
import { ReactComponent as LoaderGear2SVG } from '../../assets/images/loader/loaderGear2.svg';
import { ReactComponent as LoaderGear3SVG } from '../../assets/images/loader/loaderGear3.svg';

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
