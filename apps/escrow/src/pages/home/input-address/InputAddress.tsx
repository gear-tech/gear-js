import { Hex } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { Input, Button } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { isHex } from '@polkadot/util';
import styles from './InputAddress.module.scss';

type Props = {
  label: string;
  onSubmit: (value: Hex) => void;
};

const initialValues = { address: '' as Hex };
const validate = { address: (value: string) => (!isHex(value) ? 'Address should be hex' : null) };

function InputAddress({ label, onSubmit }: Props) {
  const { api } = useApi();

  const form = useForm({ initialValues, validate });
  const { getInputProps, errors, setFieldError } = form;

  const handleProgramSubmit = async (address: Hex) => {
    const isProgram = await api.program.is(address);

    if (isProgram) {
      onSubmit(address);
    } else {
      setFieldError('address', 'Program is not found in the storage');
    }
  };

  const submitHandler = label === 'Program address' ? handleProgramSubmit : onSubmit;

  return (
    <form onSubmit={form.onSubmit(({ address }) => submitHandler(address))}>
      <div>
        <Input label={label} {...getInputProps('address')} />
        <p className={styles.error}>{errors.address}</p>
      </div>
      <Button type="submit" text="Continue" block />
    </form>
  );
}

export { InputAddress };
