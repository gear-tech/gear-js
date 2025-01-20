import { Input as GearInput, InputProps } from '@gear-js/ui';
import { useFormContext } from 'react-hook-form';

// TODO: omit onChange and onBlur, direction types start to freak out
type Props = InputProps & {
  name: string;
};

const Input = ({ name, ...props }: Props) => {
  const { register, formState } = useFormContext();
  const { errors } = formState;

  const error = errors[name]?.message?.toString();

  return <GearInput {...props} {...register(name)} error={error} />;
};

export { Input };
