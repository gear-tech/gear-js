import { useAccount, useAlert, useBalanceFormat } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import Identicon from '@polkadot/react-identicon';

import { TimestampBlock } from '@/shared/ui/timestampBlock';
import { IdBlock } from '@/shared/ui/idBlock';
import { BulbBlock, BulbStatus } from '@/shared/ui/bulbBlock';
import { copyToClipboard, getShortName } from '@/shared/helpers';
import CopySVG from '@/shared/assets/images/actions/copyGreen.svg?react';
import { Voucher } from '@/pages/vouchers/types';

import { RevokeVoucher } from '../revoke-voucher';
import { DeclineVoucher } from '../decline-voucher';
import styles from './voucher-card.module.scss';

type Props = {
  voucher: Voucher;
  onRevoke: () => void;
  onDecline: () => void;
};

function VoucherCard({ voucher, onRevoke, onDecline }: Props) {
  const { id, balance, amount, expiryAt, expiryAtBlock, owner, spender, isDeclined } = voucher;

  const { account } = useAccount();
  const { getFormattedBalance } = useBalanceFormat();
  const alert = useAlert();

  const formattedBalance = balance ? getFormattedBalance(balance) : undefined;
  const formattedAmount = amount ? getFormattedBalance(amount) : undefined;
  const isActive = Date.now() < new Date(expiryAt).getTime();
  const isOwner = account?.decodedAddress === owner;
  const isSpender = account?.decodedAddress === spender;

  const withOwnershipAnnotation = (value: string) => {
    if (isOwner) return `${value} (Issued by you)`;
    if (isSpender) return `${value} (Issued to you)`;

    return value;
  };

  const getStatus = () => {
    if (isDeclined) return BulbStatus.Error;

    return isActive ? BulbStatus.Success : BulbStatus.Exited;
  };

  const getStatusText = () => {
    if (isDeclined) return 'Declined';

    return isActive ? 'Active' : 'Expired';
  };

  return (
    <div className={styles.card}>
      <div>
        <h3 className={styles.heading}>
          <span className={styles.balance}>{formattedBalance?.value}</span>

          <span className={styles.amount}>
            / {formattedAmount?.value} {formattedAmount?.unit}
          </span>
        </h3>

        <footer className={styles.footer}>
          <TimestampBlock timestamp={expiryAt} annotation={`#${expiryAtBlock}`} withIcon />
          <IdBlock id={id} withIcon />

          {/* TODO: divide BlockComponent from TimestampBlock, IdBlock etc. */}
          <div className={styles.owner}>
            <Identicon value={owner} size={16} theme="polkadot" />
            {getShortName(owner)}

            <Button icon={CopySVG} color="transparent" onClick={() => copyToClipboard(owner, alert)} />
          </div>

          <BulbBlock status={getStatus()} text={withOwnershipAnnotation(getStatusText())} />
        </footer>
      </div>

      {/* if owner and spender are the same person, is it still necessary to decline first? */}
      {isOwner && (!isActive || isDeclined) && <RevokeVoucher spender={spender} id={id} onSubmit={onRevoke} />}
      {isSpender && isActive && !isDeclined && <DeclineVoucher id={id} onSubmit={onDecline} />}
    </div>
  );
}

export { VoucherCard };
