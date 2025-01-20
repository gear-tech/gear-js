import { Textarea as GearTextarea, TextareaProps } from '@gear-js/ui';
import { useFormContext } from 'react-hook-form';

// TODO: omit onChange and onBlur, direction types start to freak out
type Props = TextareaProps & {
  name: string;
};

function Textarea({ name, ...props }: Props) {
  const { register, formState } = useFormContext();
  const { errors } = formState;

  const error = errors[name]?.message?.toString();

  return <GearTextarea {...props} {...register(name)} error={error} />;
}

export { Textarea };
