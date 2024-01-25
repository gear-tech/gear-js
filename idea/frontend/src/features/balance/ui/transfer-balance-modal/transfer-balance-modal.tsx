import { decodeAddress } from '@gear-js/api';
import { useAccount, useBalanceFormat } from '@gear-js/react-hooks';
import { Button, Checkbox, Modal } from '@gear-js/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import CloseSVG from '@/shared/assets/images/actions/close.svg?react';
import { Input, ValueField } from '@/shared/ui/form';
import { isAccountAddressValid } from '@/shared/helpers';
import { useBalanceTransfer } from '@/hooks';

import SubmitSVG from '../../assets/submit.svg?react';
import styles from './transfer-balance-modal.module.scss';

const defaultValues = { address: '', value: '', keepAlive: true };

const schema = yup.object().shape({
  address: yup
    .string()
    .test('is-address-valid', 'Invalid address', isAccountAddressValid)
    .required('This field is required'),
  value: yup.string().required('This field is required'),
  keepAlive: yup.boolean().required(),
});

const resolver = yupResolver(schema);

type Props = {
  close: () => void;
};

const TransferBalanceModal = ({ close }: Props) => {
  const { account } = useAccount();
  const { getChainBalanceValue } = useBalanceFormat();
  const transferBalance = useBalanceTransfer();

  const methods = useForm({ defaultValues, resolver });
  const { register } = methods;

  const handleSubmit = ({ address, value, keepAlive }: typeof defaultValues) => {
    if (!account) return;

    const chainValue = getChainBalanceValue(value).toFixed();
    const signSource = account.meta.source;
    const onSuccess = close;

    transferBalance(account.address, decodeAddress(address), chainValue, { keepAlive, signSource, onSuccess });
  };

  return (
    <Modal heading="Transfer Balance" size="large" close={close}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <div className={styles.inputs}>
            <Input name="address" label="Address" direction="y" block />
            <ValueField name="value" label="Value:" direction="y" block />
            <Checkbox label="Keep Alive" {...register('keepAlive')} />
          </div>

          <div className={styles.buttons}>
            <Button type="submit" text="Send" size="large" icon={SubmitSVG} />
            <Button icon={CloseSVG} color="light" size="large" text="Close" onClick={close} />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export { TransferBalanceModal };
