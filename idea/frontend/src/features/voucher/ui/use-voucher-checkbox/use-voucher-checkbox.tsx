import { HexString } from '@gear-js/api';
import { useAccountProgramVoucher, useAccountVoucherBalance, useBalanceFormat } from '@gear-js/react-hooks';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { LabeledCheckbox } from '@/shared/ui';

import { useVoucherStatus } from '../..';
import styles from './use-voucher-checkbox.module.scss';

type Props = {
  programId: HexString | undefined;
};

const UseVoucherCheckbox = ({ programId }: Props) => {
  const { voucher } = useAccountProgramVoucher(programId);
  const { voucherBalance, isVoucherExists, voucherId } = useAccountVoucherBalance(programId);
  const { isVoucherActive } = useVoucherStatus(voucher?.expiry);

  const { getFormattedBalance } = useBalanceFormat();

  const formattedBalance = voucherBalance ? getFormattedBalance(voucherBalance) : undefined;

  const name = 'voucherId';
  const { setValue } = useFormContext();

  useEffect(() => {
    setValue(name, false);
  }, [isVoucherExists, setValue]);

  return isVoucherExists && isVoucherActive ? (
    <LabeledCheckbox name={name} label="Voucher funds:" inputLabel="Use voucher" gap="1/5" value={voucherId}>
      <span className={styles.value}>
        ({formattedBalance?.value} {formattedBalance?.unit})
      </span>
    </LabeledCheckbox>
  ) : null;
};

export { UseVoucherCheckbox };
