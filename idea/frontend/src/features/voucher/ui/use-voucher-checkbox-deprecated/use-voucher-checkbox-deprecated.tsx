import { HexString } from '@gear-js/api';
import { useAccountVoucherDeprecated, useBalanceFormat } from '@gear-js/react-hooks';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { LabeledCheckbox } from '@/shared/ui';

import styles from './use-voucher-checkbox-deprecated.module.scss';

type Props = {
  programId: HexString | undefined;
};

const UseVoucherCheckboxDeprecated = ({ programId }: Props) => {
  const { isVoucherExists, voucherBalance } = useAccountVoucherDeprecated(programId);
  const { getFormattedBalance } = useBalanceFormat();

  const formattedBalance = voucherBalance ? getFormattedBalance(voucherBalance) : undefined;

  const name = 'withVoucher';

  // TODO: should be done by react-hook-form's global shouldUnregister,
  // however due to complications of current forms it's not possible yet.
  // take a look at this problem after forms refactoring
  const { resetField } = useFormContext();

  useEffect(() => {
    if (!isVoucherExists) resetField(name);
  }, [isVoucherExists, resetField]);

  return isVoucherExists ? (
    <LabeledCheckbox name={name} label="Voucher funds:" inputLabel="Use voucher">
      <span className={styles.value}>
        ( {formattedBalance?.value} {formattedBalance?.unit})
      </span>
    </LabeledCheckbox>
  ) : null;
};

export { UseVoucherCheckboxDeprecated };
