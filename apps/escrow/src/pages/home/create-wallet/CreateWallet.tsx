import { Input, Button } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { isHex } from '@polkadot/util';
import check from 'assets/images/icons/check.svg';
import { CreateFormValues } from 'types';
import styles from './CreateWallet.module.scss';

type Props = {
  onSubmit: (values: CreateFormValues) => void;
};

const initialValues = { buyer: '', seller: '', amount: '' };
const validate = {
  buyer: (value: string) => (!isHex(value) ? 'Address should be hex' : null),
  seller: (value: string) => (!isHex(value) ? 'Address should be hex' : null),
  amount: (value: string) => (!value ? 'Field is required' : null),
};

function CreateWallet({ onSubmit }: Props) {
  const form = useForm({ initialValues, validate });
  const { getInputProps, errors } = form;

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <div>
        <Input label="Buyer" className={styles.input} {...getInputProps('buyer')} />
        <p className={styles.error}>{errors.buyer}</p>
      </div>
      <div>
        <Input label="Seller" className={styles.input} {...getInputProps('seller')} />
        <p className={styles.error}>{errors.seller}</p>
      </div>
      <div>
        <Input type="number" label="Amount" className={styles.input} {...getInputProps('amount')} />
        <p className={styles.error}>{errors.amount}</p>
      </div>
      <Button text="Create wallet" type="submit" icon={check} block />
    </form>
  );
}

export { CreateWallet };
