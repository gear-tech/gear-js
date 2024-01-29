import { HexString } from '@gear-js/api';
import { useBalance, useBalanceFormat, useVoucherStatus } from '@gear-js/react-hooks';

type V110Props = {
  expireBlock: number;
};

type DeprecatedProps = Partial<V110Props>;

type Props = { id: HexString } & (V110Props | DeprecatedProps);

function VoucherOption({ id, expireBlock }: Props) {
  const { expirationTimestamp, isVoucherActive } = useVoucherStatus(expireBlock);
  const expirationDate = expirationTimestamp ? new Date(expirationTimestamp).toLocaleString() : '';

  const { balance } = useBalance(id);
  const { getFormattedBalance } = useBalanceFormat();

  const formattedBalance = balance ? getFormattedBalance(balance) : undefined;

  const isV110Runtime = !!expirationDate;
  const label = isV110Runtime
    ? `${formattedBalance?.value} ${formattedBalance?.unit}. Expires: ${expirationDate} (#${expireBlock})`
    : `${formattedBalance?.value} ${formattedBalance?.unit}`;

  return <option label={label} value={id} disabled={!isVoucherActive} />;
}

export { VoucherOption };
