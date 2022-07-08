import { Button, Input } from '@gear-js/ui';
import { useForm } from '@mantine/form';

type Props = {
  label: string;
  onSubmit: (value: any) => void; // any instead of string | Hex, cuz somehow here string | Hex = string
};

const initialValues = { value: '' };
const validate = { value: (value: string) => (!value ? 'Field is requierd' : null) };

function InputForm({ label, onSubmit }: Props) {
  const form = useForm({ initialValues, validate });
  const { getInputProps } = form;

  return (
    <form onSubmit={form.onSubmit(({ value }) => onSubmit(value))}>
      <Input label={label} {...getInputProps('value')} />
      <Button type="submit" text="Continue" block />
    </form>
  );
}

export { InputForm };
