import { decodeAddress } from '@gear-js/api';
import { useAccount, useBalanceFormat } from '@gear-js/react-hooks';
import { Button, Checkbox, Modal } from '@gear-js/ui';
import { useState } from 'react';
import { Form } from 'react-final-form';
import * as yup from 'yup';

import CloseSVG from '@/shared/assets/images/actions/close.svg?react';
import { FormInput, ValueField } from '@/shared/ui/form';
import { getValidation, isAccountAddressValid } from '@/shared/helpers';
import { useBalanceTransfer } from '@/hooks';

import SubmitSVG from '../../assets/submit.svg?react';
import styles from './transfer-balance-modal.module.scss';

const initialValues = { address: '', value: '' };

const validationSchema = yup.object().shape({
  address: yup
    .string()
    .test('is-address-valid', 'Invalid address', isAccountAddressValid)
    .required('This field is required'),
  value: yup.string().required('This field is required'),
});

type Props = {
  close: () => void;
};

const TransferBalanceModal = ({ close }: Props) => {
  const { account } = useAccount();
  const { getChainBalanceValue } = useBalanceFormat();
  const transferBalance = useBalanceTransfer();

  const [keepAlive, setKeepAlive] = useState(true);

  const onSubmit = ({ address, value }: typeof initialValues) => {
    if (!account) return;

    const chainValue = getChainBalanceValue(value).toFixed();
    const signSource = account.meta.source;
    const onSuccess = close;

    transferBalance(account.address, decodeAddress(address), chainValue, { keepAlive, signSource, onSuccess });
  };

  return (
    <Modal heading="Transfer Balance" size="large" close={close}>
      <Form initialValues={initialValues} onSubmit={onSubmit} validate={getValidation(validationSchema)}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className={styles.inputs}>
              <FormInput name="address" label="Address" direction="y" block />
              <ValueField name="value" label="Value:" direction="y" block />
              <Checkbox
                label="Keep Alive"
                checked={keepAlive}
                onChange={() => setKeepAlive((prevValue) => !prevValue)}
              />
            </div>

            <div className={styles.buttons}>
              <Button type="submit" text="Send" size="large" icon={SubmitSVG} />
              <Button icon={CloseSVG} color="light" size="large" text="Close" onClick={close} />
            </div>
          </form>
        )}
      </Form>
    </Modal>
  );
};

export { TransferBalanceModal };
