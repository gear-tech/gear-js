import { Button, Modal } from '@gear-js/ui';
import { HexString, decodeAddress } from '@gear-js/api';
import BigNumber from 'bignumber.js';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useBalanceMultiplier } from '@/hooks';
import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import CloseSVG from '@/shared/assets/images/actions/close.svg?react';
import { getValidation, isAccountAddressValid } from '@/shared/helpers';
import { FormInput, ValueField } from '@/shared/ui/form';

import { useIssueVoucher } from '../../hooks';
import styles from './issue-voucher-modal.module.scss';

type Props = {
  programId: HexString;
  close: () => void;
};

const defaultValues = { address: '', value: '' };

// TODOFORM:
const validationSchema = yup.object().shape({
  address: yup
    .string()
    .test('is-address-valid', 'Invalid address', isAccountAddressValid)
    .required('This field is required'),
  value: yup.string().required('This field is required'),
});

const IssueVoucherModal = ({ programId, close }: Props) => {
  const { balanceMultiplier } = useBalanceMultiplier();
  const issueVoucher = useIssueVoucher();

  const methods = useForm({ defaultValues });

  const handleSubmit = ({ address, value }: typeof defaultValues) => {
    const decodedAddress = decodeAddress(address);
    const unitValue = BigNumber(value).multipliedBy(balanceMultiplier).toFixed();

    issueVoucher(decodedAddress, programId, unitValue, close);
  };

  return (
    <Modal heading="Create Voucher" size="large" close={close}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)} className={styles.form}>
          <FormInput name="address" label="Account address" direction="y" block />
          <ValueField name="value" label="Tokens amount:" direction="y" block />

          <div className={styles.buttons}>
            <Button type="submit" icon={ApplySVG} size="large" text="Create" />
            <Button icon={CloseSVG} color="light" size="large" text="Close" onClick={close} />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export { IssueVoucherModal };
