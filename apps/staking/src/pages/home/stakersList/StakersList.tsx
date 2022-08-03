import clsx from 'clsx';

import { Box } from 'components/common/box';
import { Subtitle } from 'components/common/subtitle';
import medalSVG from 'assets/images/medal.svg';
import moneySVG from 'assets/images/money.svg';
import markerSVG from 'assets/images/marker.svg';

import styles from './StakersList.module.scss';
import { Timer } from './timer';

function StakersList() {
  const rewardCellClasses = clsx(styles.tableCell, styles.reward);
  const addressCellClasses = clsx(styles.tableCell, styles.address);

  return (
    <Box>
      {/* helper to take into account the scroll of the table */}
      <header className={clsx(styles.header, 'customScroll')}>
        <div className={styles.headerContent}>
          <div className={styles.timerWrapper}>
            <p className={styles.timerDescription}>Distribution time</p>
            <Timer />
          </div>
          <Subtitle>Stakers list</Subtitle>
        </div>
      </header>
      <div className={clsx(styles.table, 'customScroll')}>
        <div className={styles.tableContent}>
          <div className={clsx(styles.tableRow, styles.tableHeader)}>
            <span className={styles.tableCell}>
              <img src={markerSVG} alt="address" className={styles.cellIcon} />
              Address
            </span>
            <span className={styles.tableCell}>
              <img src={moneySVG} alt="money" className={styles.cellIcon} />
              Staked
            </span>
            <span className={styles.tableCell}>
              <img src={medalSVG} alt="medal" className={styles.cellIcon} />
              Total rewards
            </span>
          </div>
          <div className={styles.tableBody}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 112, 12].map((value) => (
              <div key={value} className={styles.tableRow}>
                <span className={addressCellClasses}>1BottSLRHSeqrdk1BottSLRHSeqrdk1BottSLRHSeqrdk</span>
                <span className={styles.tableCell}>{5 + value}</span>
                <span className={rewardCellClasses}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Box>
  );
}

export { StakersList };
