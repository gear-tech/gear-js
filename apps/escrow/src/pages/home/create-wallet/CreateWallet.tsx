import { Input, Button } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { isHex } from '@polkadot/util';
import { ReactComponent as check } from 'assets/images/icons/check.svg';
import { CreateFormValues } from 'types';

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
  const { getInputProps } = form;

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Input label="Buyer" color="light" direction="y" {...getInputProps('buyer')} />
      <Input label="Seller" color="light" direction="y" {...getInputProps('seller')} />
      <Input type="number" label="Amount" color="light" direction="y" {...getInputProps('amount')} />
      <Button text="Create wallet" type="submit" icon={check} block />
    </form>
  );
}

export { CreateWallet };
