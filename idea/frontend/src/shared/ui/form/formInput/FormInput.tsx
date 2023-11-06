import { Input, InputProps } from '@gear-js/ui';
import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';

import styles from '../Form.module.scss';

type Props = InputProps & {
  name: string;
};

const FormInput = ({ name, label, className, ...other }: Props) => {
  const { register, getFieldState, formState } = useFormContext();
  const { error } = getFieldState(name, formState);

  return (
    <Input
      {...other}
      {...register(name)}
      label={label}
      error={error?.message}
      className={clsx(styles.field, className)}
    />
  );
};

export { FormInput };
