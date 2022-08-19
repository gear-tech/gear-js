import { useMemo } from 'react';
import clsx from 'clsx';

import { useStakingState } from 'hooks';
import { StakersState } from 'types/state';
import { Loader } from 'components/loaders/loader';
import { Subtitle } from 'components/common/subtitle';
import medalSVG from 'assets/images/medal.svg';
import moneySVG from 'assets/images/money.svg';
import markerSVG from 'assets/images/marker.svg';

import styles from './StakersList.module.scss';
import { PAYLOAD_FOR_STAKERS_STATE } from './const';
import { Timer } from './timer';

type Props = {
  distributionTime: number;
};

function StakersList({ distributionTime }: Props) {
  const { state, isStateRead } = useStakingState<StakersState>(PAYLOAD_FOR_STAKERS_STATE);

  const rewardCellClasses = clsx(styles.tableCell, styles.reward);
  const addressCellClasses = clsx(styles.tableCell, styles.address);

  const stakers = useMemo(() => {
    if (!state?.Stakers) {
      return [];
    }

    return Object.entries(state.Stakers).map(([id, value]) => (
      <div key={id} className={styles.tableRow}>
        <span className={addressCellClasses}>{id}</span>
        <span className={styles.tableCell}>{value.balance}</span>
        <span className={rewardCellClasses}>{value.reward}</span>
      </div>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.timerWrapper}>
          <p className={styles.timerDescription}>Distribution time</p>
          <Timer time={distributionTime} />
        </div>
        <Subtitle>Stakers list</Subtitle>
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
          {state && isStateRead ? (
            <div className={styles.tableBody}>
              {stakers.length ? stakers : <p className={styles.emptyContent}>No stakers</p>}
            </div>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </>
  );
}

export { StakersList };
