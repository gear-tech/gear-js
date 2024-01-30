import { HexString } from '@gear-js/api';
import { useAccountVouchers } from '@gear-js/react-hooks';
import { InputWrapper } from '@gear-js/ui';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Select } from '@/shared/ui';

import { VoucherOption } from './voucher-option';

type Props = {
  programId: HexString | undefined;
};

const VoucherSelect = ({ programId }: Props) => {
  const { vouchers } = useAccountVouchers(programId);
  const voucherEntries = Object.entries(vouchers || {});
  const vouchersCount = voucherEntries.length;

  const name = 'voucherId';

  const renderVouchers = () =>
    voucherEntries.map(([id, { expiry }]) => <VoucherOption key={id} id={id as HexString} expireBlock={expiry} />);

  // TODO: should be done by react-hook-form's global shouldUnregister,
  // however due to complications of current forms it's not possible yet.
  // take a look at this problem after forms refactoring
  const { resetField } = useFormContext();

  useEffect(() => {
    if (!vouchersCount) resetField(name);
  }, [vouchersCount, resetField]);

  return vouchersCount ? (
    <InputWrapper id={name} label="Voucher funds:" size="normal" direction="x" gap="1/5">
      <Select name={name}>
        <option value="" label="No voucher" />

        {renderVouchers()}
      </Select>
    </InputWrapper>
  ) : null;
};

export { VoucherSelect };
