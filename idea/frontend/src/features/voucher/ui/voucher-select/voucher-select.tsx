import { HexString, IVoucherDetails } from '@gear-js/api';
import { getTypedEntries, useAccountVouchers } from '@gear-js/react-hooks';
import { InputWrapper, InputWrapperProps } from '@gear-js/ui';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Select } from '@/shared/ui';

import { VoucherOption } from './voucher-option';

type Props = Omit<InputWrapperProps, 'id' | 'label' | 'size' | 'children'> & {
  entries: [HexString, IVoucherDetails][];
};

const VoucherSelect = ({ entries, ...props }: Props) => {
  const name = 'voucherId';
  const vouchersCount = entries.length;

  const renderVouchers = () =>
    entries.map(([id, { expiry }]) => <VoucherOption key={id} id={id} expireBlock={expiry} />);

  // TODO: should be done by react-hook-form's global shouldUnregister,
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
  const { vouchers } = useAccountVouchers(programId);
  const entries = getTypedEntries(vouchers || {});

  return <VoucherSelect entries={entries} direction="x" gap="1/5" />;
};

const CodeVoucherSelect = () => {
  const { vouchers } = useAccountVouchers();
  const entries = getTypedEntries(vouchers || {}).filter(([, { codeUploading }]) => codeUploading);

  return <VoucherSelect entries={entries} direction="y" />;
};

export { ProgramVoucherSelect, CodeVoucherSelect };
