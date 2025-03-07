import { getVaraAddress, useAccount, useBalanceFormat } from '@gear-js/react-hooks';

import { TimestampBlock, IdBlock, BulbStatus, OwnerBlock } from '@/shared/ui';
import { BulbBlock } from '@/shared/ui/bulbBlock';

import { Voucher } from '../../api';
import { DeclineVoucher } from '../decline-voucher';
import { RevokeVoucher } from '../revoke-voucher';
import { UpdateVoucher } from '../update-voucher';

import styles from './voucher-card.module.scss';

type Props = {
  voucher: Voucher;
  onChange: () => void;
};

function VoucherCard({ voucher, onChange }: Props) {
  const { id, balance, amount, expiryAt, expiryAtBlock, owner: decodedOwnerAddress, spender, isDeclined } = voucher;
  const ownerAddress = getVaraAddress(decodedOwnerAddress);

  const { account } = useAccount();
  const { getFormattedBalance } = useBalanceFormat();

  const formattedBalance = balance ? getFormattedBalance(balance) : undefined;
  const formattedAmount = amount ? getFormattedBalance(amount) : undefined;
  const isActive = Date.now() < new Date(expiryAt).getTime();
  const isOwner = account?.decodedAddress === decodedOwnerAddress;
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
      <div className={styles.body}>
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
          <OwnerBlock ownerAddress={ownerAddress} />

          <BulbBlock status={getStatus()} text={withOwnershipAnnotation(getStatusText())} />
        </footer>
      </div>

      <div className={styles.buttons}>
        {isOwner && !isDeclined && <UpdateVoucher voucher={voucher} onSubmit={onChange} />}
        {isOwner && (!isActive || isDeclined) && <RevokeVoucher spender={spender} id={id} onSubmit={onChange} />}
        {isSpender && isActive && !isDeclined && <DeclineVoucher id={id} onSubmit={onChange} />}
      </div>
    </div>
  );
}

export { VoucherCard };
