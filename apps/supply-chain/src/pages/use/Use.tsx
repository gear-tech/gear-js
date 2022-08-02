import { Hex } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { isHex } from '@polkadot/util';
import { Box, Content, Input } from 'components';
import styles from './Use.module.scss';

type Props = {
  onCancel: () => void;
  onSubmit: (value: Hex) => void;
};

const initialValues = { programId: '' as Hex };
const validate = { programId: (value: string) => (!isHex(value) ? 'Address should be hex' : null) };

function Use({ onCancel, onSubmit }: Props) {
  const { api } = useApi();
  const form = useForm({ initialValues, validate });
  const { getInputProps, values, setFieldError } = form;

  const isProgramExists = () => api.program.exists(values.programId);

  const handleSubmit = form.onSubmit(async ({ programId }) => {
    if (await isProgramExists()) {
      onSubmit(programId);
    } else setFieldError('programId', 'Program not found in the storage');
  });

  return (
    <Content
      heading="Type here the ID of an existing supply chain program 
  and click “Login” to continue."
      className={styles.content}>
      <form onSubmit={handleSubmit}>
        <Box>
          <Input label="Program ID" className={styles.input} {...getInputProps('programId')} />
        </Box>
        <div className={styles.buttons}>
          <Button text="Cancel" color="secondary" onClick={onCancel} />
          <Button type="submit" text="Submit" />
        </div>
      </form>
    </Content>
  );
}

export { Use };
