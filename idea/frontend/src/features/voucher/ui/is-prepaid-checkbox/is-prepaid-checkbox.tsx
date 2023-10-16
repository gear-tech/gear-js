import { HexString } from '@gear-js/api';
import { InputWrapper, Checkbox } from '@gear-js/ui';
import { useBalanceFormat, useVoucher } from '@gear-js/react-hooks';
import { FieldRenderProps, useField } from 'react-final-form';

import styles from './is-prepaid-checkbox.module.scss';

type Props = {
  programId: HexString | undefined;
};

const IsPrepaidCheckbox = ({ programId }: Props) => {
  const { isVoucherExists, voucherBalance } = useVoucher(programId);
  const { getFormattedBalance } = useBalanceFormat();

  const field = useField('isPrepaid', { type: 'checkbox' });
  const input = field.input as Omit<FieldRenderProps<HTMLInputElement>, 'type'>; // assert cuz Checkbox type is 'switch' | undefined

  const formattedBalance = voucherBalance ? getFormattedBalance(voucherBalance) : undefined;

  return isVoucherExists ? (
    <InputWrapper
      id="voucher"
      direction="x"
      size="normal"
      gap="1/5"
      label="Voucher funds:"
      className={styles.inputWrapper}>
      <div className={styles.checkboxWrapper}>
        <Checkbox label="Use voucher" {...input} />

        <span className={styles.value}>
          ( {formattedBalance?.value} {formattedBalance?.unit})
        </span>
      </div>
    </InputWrapper>
  ) : null;
};

export { IsPrepaidCheckbox };
