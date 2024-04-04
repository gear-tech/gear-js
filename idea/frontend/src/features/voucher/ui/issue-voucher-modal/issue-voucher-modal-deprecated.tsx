import { Button, Modal } from '@gear-js/ui';
import { HexString, decodeAddress } from '@gear-js/api';
import { useBalanceFormat } from '@gear-js/react-hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import CloseSVG from '@/shared/assets/images/actions/close.svg?react';
import { isAccountAddressValid } from '@/shared/helpers';
import { Input, ValueField } from '@/shared/ui/form';

import { useIssueVoucher } from '../../hooks';
import styles from './issue-voucher-modal.module.scss';

type Props = {
  programId: HexString;
  close: () => void;
};

const defaultValues = { address: '', value: '' };

const schema = yup.object().shape({
  address: yup
    .string()
    .test('is-address-valid', 'Invalid address', isAccountAddressValid)
    .required('This field is required'),
  value: yup.string().required('This field is required'),
});

const resolver = yupResolver(schema);

const IssueVoucherModalDeprecated = ({ programId, close }: Props) => {
  const { getChainBalanceValue } = useBalanceFormat();
  const { issueVoucherDeprecated } = useIssueVoucher();

  const methods = useForm({ defaultValues, resolver });

  const handleSubmit = ({ address, value }: typeof defaultValues) => {
    const decodedAddress = decodeAddress(address);
    const chainValue = getChainBalanceValue(value).toFixed();

    issueVoucherDeprecated(decodedAddress, programId, chainValue, close);
  };

  return (
    <Modal heading="Create Voucher" size="large" close={close}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)} className={styles.form}>
          <Input name="address" label="Account address" direction="y" block />
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

export { IssueVoucherModalDeprecated };
