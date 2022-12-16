import { Hex } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { useForm } from '@mantine/form';
import { isHex } from '@polkadot/util';
import { Button } from '../button';
import commonStyles from '../connect/Connect.module.scss';
import { Input } from '../input';
import styles from './Address.module.scss';

type Props = {
  onSubmit: (value: Hex) => void;
  onBack: () => void;
};

const initialValues = { programId: '' as Hex };
const validate = { programId: (value: string) => (isHex(value) ? null : 'Address should be hex') };

function Address({ onSubmit, onBack }: Props) {
  const { api } = useApi();

  const form = useForm({ initialValues, validate });
  const { values, setFieldError, getInputProps } = form;

  const isProgramExists = () => api.program.exists(values.programId);

  const handleSubmit = form.onSubmit(async ({ programId }) => {
    if (await isProgramExists()) {
      onSubmit(programId);
    } else setFieldError('programId', 'Program not found in the storage');
  });

  return (
    <div className={commonStyles.overlay}>
      <h2 className={commonStyles.heading}>Fill data to continue</h2>

      <form onSubmit={handleSubmit} id="address-form">
        <Input {...getInputProps('programId')} />
      </form>

      <div className={styles.buttons}>
        <Button text="Go Back" onClick={onBack} />
        <Button type="submit" text="Continue" form="address-form" />
      </div>
    </div>
  );
}

export { Address };
