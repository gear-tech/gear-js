import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { Input } from 'components';
import { USER } from 'consts';
import { isValidHex } from 'utils';
import commonStyles from '../Create.module.scss';
import styles from './UserForm.module.scss';

type Props = {
  onSubmit: (type: string, user: Hex) => void;
};

const initialValues = { user: '' as Hex };
const validate = { user: isValidHex };

function UserForm({ onSubmit }: Props) {
  const form = useForm({ initialValues, validate });
  const { getInputProps, reset } = form;

  const handleSubmit = form.onSubmit(({ user }, e) => {
    // @ts-ignore
    const submitButtonName = e.nativeEvent.submitter.name;
    onSubmit(submitButtonName, user);
    reset();
  });

  return (
    <form onSubmit={handleSubmit}>
      <Input label="User ID" className={commonStyles.input} {...getInputProps('user')} />
      <div className={styles.buttons}>
        <Button type="submit" text="Add producer" color="secondary" size="small" name={USER.PRODUCER} />
        <Button type="submit" text="Add distributor" color="secondary" size="small" name={USER.DISTRIBUTOR} />
        <Button type="submit" text="Add retailer" color="secondary" size="small" name={USER.RETAILER} />
      </div>
    </form>
  );
}

export { UserForm };
