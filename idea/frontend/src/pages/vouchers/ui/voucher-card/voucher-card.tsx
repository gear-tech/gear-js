import { useBalance, useBalanceFormat } from '@gear-js/react-hooks';

import { TimestampBlock } from '@/shared/ui/timestampBlock';
import { IdBlock } from '@/shared/ui/idBlock';
import { BulbBlock, BulbStatus } from '@/shared/ui/bulbBlock';

import { useBlockTimestamp } from '../../hooks';
import styles from './voucher-card.module.scss';

type Props = {
  id: string;
  expireBlock: number;
};

function VoucherCard({ id, expireBlock }: Props) {
  const { balance } = useBalance(id);
  const { getFormattedBalance } = useBalanceFormat();

  const formattedBalance = balance ? getFormattedBalance(balance) : undefined;

  const { blockTimestamp } = useBlockTimestamp(expireBlock);
  const isActive = blockTimestamp && blockTimestamp > Date.now();

  return (
    <div className={styles.card}>
      <h3 className={styles.balance}>
        <span className={styles.value}>{formattedBalance?.value}</span>
        &nbsp;{formattedBalance?.unit}
      </h3>

      <footer className={styles.footer}>
        {blockTimestamp && <TimestampBlock timestamp={blockTimestamp} withIcon />}

        <IdBlock id={id} withIcon />

        {blockTimestamp && (
          <BulbBlock status={isActive ? BulbStatus.Success : BulbStatus.Error} text={isActive ? 'Active' : 'Expired'} />
        )}
      </footer>
    </div>
  );
}

export { VoucherCard };
