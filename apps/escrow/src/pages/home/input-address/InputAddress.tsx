import { Hex } from '@gear-js/api';
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
  const form = useForm({ initialValues, validate });
  const { getInputProps, errors } = form;

  return (
    <form onSubmit={form.onSubmit(({ address }) => onSubmit(address))}>
      <div>
        <Input label={label} {...getInputProps('address')} />
        <p className={styles.error}>{errors.address}</p>
      </div>
      <Button type="submit" text="Continue" block />
    </form>
  );
}

export { InputAddress };
