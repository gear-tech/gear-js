import { HexString } from '@gear-js/api';
import { useAccount, useBalanceFormat } from '@gear-js/react-hooks';
import { InputWrapper, InputWrapperProps } from '@gear-js/ui';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Select } from '@/shared/ui';

import { useVouchers, Voucher } from '../../api';

type Props = Omit<InputWrapperProps, 'id' | 'label' | 'size' | 'children'> & {
  vouchers: Voucher[];
};

const VoucherSelect = ({ vouchers, ...props }: Props) => {
  const name = 'voucherId';
  const vouchersCount = vouchers.length;

  const { getFormattedBalance } = useBalanceFormat();

  const renderVouchers = () =>
    vouchers.map(({ id, expiryAt, expiryAtBlock, balance }) => {
      const formattedBalance = balance ? getFormattedBalance(balance) : undefined;
      const expirationDate = new Date(expiryAt);
      const isActive = Date.now() < expirationDate.getTime();

      return (
        <option
          key={id}
          label={`${formattedBalance?.value} ${
            formattedBalance?.unit
          }. Expires: ${expirationDate.toLocaleString()} (#${expiryAtBlock})`}
          value={id}
          disabled={!isActive}
        />
      );
    });

  // TODO: probably should be done by react-hook-form's global shouldUnregister,
  // however due to complications of current forms it's not possible yet.
  // take a look at this problem after forms refactoring
  const { resetField } = useFormContext();

  useEffect(() => {
    if (!vouchersCount) resetField(name);
  }, [vouchersCount, resetField]);

  return vouchersCount ? (
    <InputWrapper id={name} label="Voucher funds" size="normal" {...props}>
      <Select name={name}>
        <option value="" label="No voucher" />

        {renderVouchers()}
      </Select>
    </InputWrapper>
  ) : null;
};

const ProgramVoucherSelect = ({ programId }: { programId: HexString | undefined }) => {
  const { account } = useAccount();

  const { data } = useVouchers(
    { programs: programId ? [programId] : undefined, spender: account?.decodedAddress },
    Boolean(programId && account),
  );

  return <VoucherSelect vouchers={data?.vouchers || []} direction="x" gap="1/5" />;
};

const CodeVoucherSelect = () => {
  const { account } = useAccount();

  const { data } = useVouchers({ codeUploading: true, spender: account?.decodedAddress }, Boolean(account));

  return <VoucherSelect vouchers={data?.vouchers || []} direction="y" />;
};

export { ProgramVoucherSelect, CodeVoucherSelect };
