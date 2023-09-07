import { HexString } from '@gear-js/api';
import { InputWrapper, Checkbox } from '@gear-js/ui';
import { FieldRenderProps, useField } from 'react-final-form';

import { useAccount } from '@gear-js/react-hooks';
import { useVoucher } from '../../hooks';
import styles from './is-prepaid-checkbox.module.scss';

type Props = {
  programId: HexString | undefined;
};

const IsPrepaidCheckbox = ({ programId }: Props) => {
  const { account } = useAccount();

  const field = useField('isPrepaid', { type: 'checkbox' });
  const input = field.input as Omit<FieldRenderProps<HTMLInputElement>, 'type'>; // assert cuz Checkbox type is 'switch' | undefined

  const { isVoucherExists, voucherBalance } = useVoucher(programId);

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
          ({voucherBalance} {account?.balance.unit})
        </span>
      </div>
    </InputWrapper>
  ) : null;
};

export { IsPrepaidCheckbox };
