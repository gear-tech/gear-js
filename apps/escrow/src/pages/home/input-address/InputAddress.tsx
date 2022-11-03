import { Hex } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { Input, Button } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { isHex } from '@polkadot/util';
import check from 'assets/images/icons/check.svg';

type Props = {
  label: string;
  onSubmit: (value: Hex) => void;
};

const initialValues = { address: '' as Hex };
const validate = { address: (value: string) => (!isHex(value) ? 'Address should be hex' : null) };

function InputAddress({ label, onSubmit }: Props) {
  const { api } = useApi();

  const form = useForm({ initialValues, validate });
  const { getInputProps, setFieldError } = form;

  const handleSubmit = async (address: Hex) => {
    const isProgram = await api.program.exists(address);

    if (isProgram) {
      onSubmit(address);
    } else {
      setFieldError('address', 'Program is not found in the storage');
    }
  };

  return (
    <form onSubmit={form.onSubmit(({ address }) => handleSubmit(address))}>
      <Input label={label} color="light" direction="y" {...getInputProps('address')} />
      <Button type="submit" text="Continue" icon={check} block />
    </form>
  );
}

export { InputAddress };
