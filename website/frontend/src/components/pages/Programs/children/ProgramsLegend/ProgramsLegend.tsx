import styles from './ProgramsLegend.module.scss';

import codeSVG from 'assets/images/code_icon.svg';
import menuSVG from 'assets/images/menu_icon.svg';
import timestampSVG from 'assets/images/timestamp_icon.svg';

const ProgramsLegend = () => (
  <div className={styles.legend}>
    <div className={styles.legendItem}>
      <img className={styles.legendIcon} src={codeSVG} alt="program name" />
      <p className={styles.legendCaption}>Program name</p>
    </div>
    <div className={styles.legendItem}>
      <img className={styles.legendIcon} src={timestampSVG} alt="timestamp" />
      <p>Timestamp</p>
    </div>
    <div className={styles.legendItem}>
      <img className={styles.legendIcon} src={menuSVG} alt="actions" />
      <p>Send message / Upload metadata</p>
    </div>
  </div>
);

export { ProgramsLegend };
