import { useBalance, useBalanceFormat, useVoucherStatus } from '@gear-js/react-hooks';

import { TimestampBlock } from '@/shared/ui/timestampBlock';
import { IdBlock } from '@/shared/ui/idBlock';
import { BulbBlock, BulbStatus } from '@/shared/ui/bulbBlock';

import styles from './voucher-card.module.scss';

type V110Props = {
  expireBlock: number;
};

type DeprecatedProps = Partial<V110Props>;

type Props = { id: string } & (V110Props | DeprecatedProps);

function VoucherCard({ id, expireBlock }: Props) {
  const { balance } = useBalance(id);
  const { getFormattedBalance } = useBalanceFormat();

  const formattedBalance = balance ? getFormattedBalance(balance) : undefined;

  const { expirationTimestamp, isVoucherStatusReady, isVoucherActive } = useVoucherStatus(expireBlock);

  return (
    <div className={styles.card}>
      <h3 className={styles.balance}>
        <span className={styles.value}>{formattedBalance?.value}</span>
        &nbsp;{formattedBalance?.unit}
      </h3>

      <footer className={styles.footer}>
        {expirationTimestamp && <TimestampBlock timestamp={expirationTimestamp} withIcon />}

        <IdBlock id={id} withIcon />

        {isVoucherStatusReady && (
          <BulbBlock
            status={isVoucherActive ? BulbStatus.Success : BulbStatus.Error}
            text={isVoucherActive ? 'Active' : 'Expired'}
          />
        )}
      </footer>
    </div>
  );
}

export { VoucherCard };
