import { useForm } from '@mantine/form';
import { Form, Input } from 'components';
import { isExists } from 'utils';
import commonStyles from '../../Role.module.scss';

type Props = {
  heading: string;
  onSubmit: () => void;
};

const initialValues = { name: '', description: '' };
const validate = { name: isExists, description: isExists };

function Produce({ heading, onSubmit }: Props) {
  const form = useForm({ initialValues, validate });
  const { getInputProps } = form;

  return (
    <Form heading={heading} onSubmit={onSubmit}>
      <Input label="Name" inputClassName={commonStyles.input} {...getInputProps('name')} />
      <Input label="Description" inputClassName={commonStyles.input} {...getInputProps('description')} />
    </Form>
  );
}

export { Produce };
