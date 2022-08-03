import { Subtitle } from 'components/common/subtitle';
import medalSVG from 'assets/images/medal.svg';
import moneySVG from 'assets/images/money.svg';
import markerSVG from 'assets/images/marker.svg';

import styles from './StakersList.module.scss';
import { Timer } from './timer';

function StakersList() {
  return (
    <div className={styles.listWrapper}>
      <header className={styles.header}>
        <div className={styles.timerWrapper}>
          <p className={styles.timerDescription}>Distribution time</p>
          <Timer />
        </div>
        <Subtitle>Stakers list</Subtitle>
      </header>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.tableCell}>
            <img src={markerSVG} alt="address" className={styles.cellIcon} />
            <span className={styles.cellText}>Address</span>
          </div>
          <div className={styles.tableCell}>
            <img src={moneySVG} alt="money" className={styles.cellIcon} />
            <span className={styles.cellText}>Staked</span>
          </div>
          <div className={styles.tableCell}>
            <img src={medalSVG} alt="medal" className={styles.cellIcon} />
            <span className={styles.cellText}>Total rewards</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { StakersList };
