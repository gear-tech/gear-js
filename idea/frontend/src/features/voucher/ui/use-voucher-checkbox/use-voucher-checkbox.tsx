import { HexString } from '@gear-js/api';
import { useAccountVoucherBalance, useBalanceFormat } from '@gear-js/react-hooks';

import { LabeledCheckbox } from '@/shared/ui';

import styles from './use-voucher-checkbox.module.scss';

type Props = {
  programId: HexString | undefined;
};

const UseVoucherCheckbox = ({ programId }: Props) => {
  const { voucherBalance, isVoucherExists, voucherId } = useAccountVoucherBalance(programId);
  const { getFormattedBalance } = useBalanceFormat();

  const formattedBalance = voucherBalance ? getFormattedBalance(voucherBalance) : undefined;

  return isVoucherExists ? (
    <LabeledCheckbox name="voucherId" label="Voucher funds:" inputLabel="Use voucher" gap="1/5" value={voucherId}>
      <span className={styles.value}>
        ({formattedBalance?.value} {formattedBalance?.unit})
      </span>
    </LabeledCheckbox>
  ) : null;
};

export { UseVoucherCheckbox };
