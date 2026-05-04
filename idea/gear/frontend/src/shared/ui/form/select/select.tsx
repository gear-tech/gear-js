import { Select as GearSelect, type SelectProps } from '@gear-js/ui';
import { useFormContext } from 'react-hook-form';

// TODO: omit onChange and onBlur, options types start to freak out
type Props = SelectProps & {
  name: string;
};

function Select({ name, ...props }: Props) {
  const { register } = useFormContext();

  return <GearSelect {...props} {...register(name)} />;
}

export { Select };
