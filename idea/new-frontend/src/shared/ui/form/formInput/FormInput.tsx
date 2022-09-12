import { useField } from 'react-final-form';
import { Input, InputProps } from '@gear-js/ui';

type Props = InputProps & {
  name: string;
};

const FormInput = (props: Props) => {
  const { name, label, className, ...other } = props;

  const { input, meta } = useField(name);

  const error = meta.invalid && meta.touched ? meta.error : undefined;
  // @ts-ignore
  return <Input {...other} {...input} label={label} error={error} direction="y" />;
};

export { FormInput };
