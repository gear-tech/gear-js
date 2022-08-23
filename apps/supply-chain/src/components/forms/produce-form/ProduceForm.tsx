import { useForm } from '@mantine/form';
import { Form, Input } from 'components';
import { isExists } from 'utils';
import commonStyles from '../form/Form.module.scss';

type Props = {
  heading: string;
  onSubmit: (value: any, onSuccess: () => void) => void;
};

const initialValues = { name: '', description: '' };
const validate = { name: isExists, description: isExists };

function ProduceForm({ heading, onSubmit }: Props) {
  const form = useForm({ initialValues, validate });
  const { getInputProps, reset } = form;

  const handleSubmit = form.onSubmit((values) => onSubmit(values, reset));

  return (
    <Form heading={heading} onSubmit={handleSubmit}>
      <Input label="Name" inputClassName={commonStyles.input} {...getInputProps('name')} />
      <Input label="Description" inputClassName={commonStyles.input} {...getInputProps('description')} />
    </Form>
  );
}

export { ProduceForm };
