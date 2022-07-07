import { Input, Button } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { CreateFormValues } from 'types';
import styles from './CreateWallet.module.scss';

type Props = {
  onSubmit: (values: CreateFormValues) => void;
};

const initialValues = { buyer: '', seller: '', amount: '' };

function CreateWallet({ onSubmit }: Props) {
  const form = useForm({ initialValues });
  const { getInputProps } = form;

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Input label="Buyer" className={styles.input} {...getInputProps('buyer')} />
      <Input label="Seller" className={styles.input} {...getInputProps('seller')} />
      <Input label="Amount" className={styles.input} {...getInputProps('amount')} />
      <Button text="Create wallet" type="submit" block />
    </form>
  );
}

export { CreateWallet };
