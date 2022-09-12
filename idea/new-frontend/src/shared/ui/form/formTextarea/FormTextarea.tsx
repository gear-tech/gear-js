import { useField } from 'react-final-form';
import { Textarea, TextareaProps } from '@gear-js/ui';

type Props = TextareaProps & {
  name: string;
};

const FormTextarea = (props: Props) => {
  const { name, label, className, ...other } = props;

  const { input, meta } = useField(name);

  const error = meta.invalid && meta.touched ? meta.error : undefined;
  // @ts-ignore
  return <Textarea {...other} {...input} label={label} error={error} direction="y" className={className} />;
};

export { FormTextarea };
