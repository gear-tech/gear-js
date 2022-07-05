import { Input, Button } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { Box } from 'components';
import { CreateWalletFormData } from 'types';
import styles from './InitWalletForm.module.scss';

type Props = {
  onSubmit: (data: CreateWalletFormData) => void;
};

const initialValues = { buyer: '', seller: '', amount: '' };

function InitWalletForm({ onSubmit }: Props) {
  const form = useForm({ initialValues });
  const { getInputProps, reset } = form;

  return (
    <Box>
      <form onSubmit={form.onSubmit((values) => onSubmit({ values, onSuccess: reset }))}>
        <Input label="Buyer" className={styles.input} {...getInputProps('buyer')} />
        <Input label="Seller" className={styles.input} {...getInputProps('seller')} />
        <Input label="Amount" className={styles.input} {...getInputProps('amount')} />
        <Button text="Create wallet" type="submit" block />
      </form>
    </Box>
  );
}

export { InitWalletForm };
