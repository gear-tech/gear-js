import { HexString } from '@gear-js/api';
import { useAlert, useBalance, useBalanceFormat, useVoucherStatus } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import Identicon from '@polkadot/react-identicon';

import { TimestampBlock } from '@/shared/ui/timestampBlock';
import { IdBlock } from '@/shared/ui/idBlock';
import { BulbBlock, BulbStatus } from '@/shared/ui/bulbBlock';
import { copyToClipboard, getShortName } from '@/shared/helpers';
import CopySVG from '@/shared/assets/images/actions/copyGreen.svg?react';

import styles from './voucher-card.module.scss';

type Props = {
  id: string;
  owner: HexString;
  expireBlock: number;
};

function VoucherCard({ id, owner, expireBlock }: Props) {
  const alert = useAlert();
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
        {expirationTimestamp && (
          <TimestampBlock timestamp={expirationTimestamp} annotation={`#${expireBlock}`} withIcon />
        )}

        <IdBlock id={id} withIcon />

        {/* TODO: divide BlockComponent from TimestampBlock, IdBlock etc. */}
        <div className={styles.owner}>
          <Identicon value={owner} size={16} theme="polkadot" />
          {getShortName(owner)}

          <Button icon={CopySVG} color="transparent" onClick={() => copyToClipboard(owner, alert)} />
        </div>

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
