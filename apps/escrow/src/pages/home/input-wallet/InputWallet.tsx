import { Button, Input } from '@gear-js/ui';
import { useForm } from '@mantine/form';

type Props = {
  onSubmit: (value: string) => void;
};

const initialValues = { address: '' };

function InputWallet({ onSubmit }: Props) {
  const form = useForm({ initialValues });
  const { getInputProps } = form;

  return (
    <form onSubmit={form.onSubmit(({ address }) => onSubmit(address))}>
      <Input label="Wallet address" {...getInputProps('address')} />
      <Button type="submit" text="Continue" block />
    </form>
  );
}

export { InputWallet };
