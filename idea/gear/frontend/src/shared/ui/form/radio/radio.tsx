import { Radio as GearRadio, RadioProps } from '@gear-js/ui';
import { useFormContext } from 'react-hook-form';

type Props = Omit<RadioProps, 'onChange' | 'onBlur'> & {
  name: string;
};

function Radio({ name, ...props }: Props) {
  const { register } = useFormContext();

  return <GearRadio {...props} {...register(name)} />;
}

export { Radio };
