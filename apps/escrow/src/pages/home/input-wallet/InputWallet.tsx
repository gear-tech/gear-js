import { Button, Input } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import styles from './InputWallet.module.scss';

type Props = {
  onSubmit: (value: string) => void;
};

const initialValues = { id: '' };
const validate = { id: (value: string) => (!value ? 'Field is requierd' : null) };

function InputWallet({ onSubmit }: Props) {
  const form = useForm({ initialValues, validate });
  const { getInputProps, errors } = form;

  return (
    <form onSubmit={form.onSubmit(({ id }) => onSubmit(id))}>
      <div>
        <Input type="number" label="Wallet ID" {...getInputProps('id')} />
        <p className={styles.error}>{errors.id}</p>
      </div>
      <Button type="submit" text="Continue" block />
    </form>
  );
}

export { InputWallet };
