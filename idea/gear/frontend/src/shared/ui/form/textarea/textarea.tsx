import { Textarea as GearTextarea, TextareaProps } from '@gear-js/ui';
import { useFormContext } from 'react-hook-form';

// TODO: omit onChange and onBlur, direction types start to freak out
type Props = TextareaProps & {
  name: string;
};

function Textarea({ name, ...props }: Props) {
  const { register, formState } = useFormContext();
  const { errors } = formState;

  // eslint-disable-next-line @typescript-eslint/no-base-to-string -- TODO(#1800): resolve eslint comments
  const error = errors[name]?.message?.toString();

  return <GearTextarea {...props} {...register(name)} error={error} />;
}

export { Textarea };
