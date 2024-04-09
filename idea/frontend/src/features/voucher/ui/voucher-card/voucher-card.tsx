import { HexString } from '@gear-js/api';
import { useAccount, useAlert, useBalanceFormat } from '@gear-js/react-hooks';
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
  balance: string;
  amount: string;
  expirationBlock: string;
  expirationTimestamp: string;
  owner: HexString;
  spender: HexString;
};

function VoucherCard({ id, balance, amount, expirationBlock, expirationTimestamp, owner, spender }: Props) {
  const { account } = useAccount();
  const { getFormattedBalance } = useBalanceFormat();
  const alert = useAlert();

  const formattedBalance = balance ? getFormattedBalance(balance) : undefined;
  const formattedAmount = amount ? getFormattedBalance(amount) : undefined;

  const isVoucherActive = Date.now() < new Date(expirationTimestamp).getTime();

  const withOwnershipAnnotation = (value: string) => {
    const isOwner = account?.decodedAddress === owner;
    if (isOwner) return `${value} (Issued by you)`;

    const isSpender = account?.decodedAddress === spender;
    if (isSpender) return `${value} (Issued to you)`;

    return value;
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.heading}>
        <span className={styles.balance}>{formattedBalance?.value}</span>

        <span className={styles.amount}>
          / {formattedAmount?.value} {formattedAmount?.unit}
        </span>
      </h3>

      <footer className={styles.footer}>
        <TimestampBlock timestamp={expirationTimestamp} annotation={`#${expirationBlock}`} withIcon />
        <IdBlock id={id} withIcon />

        {/* TODO: divide BlockComponent from TimestampBlock, IdBlock etc. */}
        <div className={styles.owner}>
          <Identicon value={owner} size={16} theme="polkadot" />
          {getShortName(owner)}

          <Button icon={CopySVG} color="transparent" onClick={() => copyToClipboard(owner, alert)} />
        </div>

        <BulbBlock
          status={isVoucherActive ? BulbStatus.Success : BulbStatus.Error}
          text={withOwnershipAnnotation(isVoucherActive ? 'Active' : 'Expired')}
        />
      </footer>
    </div>
  );
}

export { VoucherCard };
