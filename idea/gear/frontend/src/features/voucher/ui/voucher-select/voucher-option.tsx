import { HexString } from '@gear-js/api';
import { useBalance, useBalanceFormat, useVoucherStatus } from '@gear-js/react-hooks';

type Props = {
  id: HexString;
  expireBlock: number;
};

function VoucherOption({ id, expireBlock }: Props) {
  const { expirationTimestamp, isVoucherActive } = useVoucherStatus(expireBlock);
  const expirationDate = expirationTimestamp ? new Date(expirationTimestamp).toLocaleString() : '';

  const { balance } = useBalance(id);
  const { getFormattedBalance } = useBalanceFormat();

  const formattedBalance = balance ? getFormattedBalance(balance) : undefined;

  const label = `${formattedBalance?.value} ${formattedBalance?.unit}. Expires: ${expirationDate} (#${expireBlock})`;

  return <option label={label} value={id} disabled={!isVoucherActive} />;
}

export { VoucherOption };
