import { Button, Select } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { Wallet } from 'types';
import styles from './SelectWallet.module.scss';

type Props = {
  wallets: Wallet[] | undefined;
  onSubmit: (value: string) => void;
};

function SelectWallet({ wallets, onSubmit }: Props) {
  const initialValues = { id: wallets?.[0]?.[0] };
  const isAnyWallet = !!wallets?.length;

  const form = useForm({ initialValues });
  const { getInputProps } = form;

  const getOptions = () => wallets?.map(([id]) => ({ label: id, value: id })) || [];

  return isAnyWallet ? (
    <form onSubmit={form.onSubmit(({ id }) => onSubmit(id as string))}>
      <Select label="Wallet ID" options={getOptions()} {...getInputProps('id')} />
      <Button type="submit" text="Continue" block />
    </form>
  ) : (
    <p className={styles.text}>There are no wallets in your contract, please create one</p>
  );
}

export { SelectWallet };
