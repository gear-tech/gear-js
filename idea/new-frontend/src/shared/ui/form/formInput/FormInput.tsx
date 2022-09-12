import { useField } from 'react-final-form';
import clsx from 'clsx';
import { Input, InputProps } from '@gear-js/ui';

import styles from '../Form.module.scss';

type Props = InputProps & {
  name: string;
};

const FormInput = (props: Props) => {
  const { name, label, className, ...other } = props;

  const { input, meta } = useField(name);

  const error = meta.invalid && meta.touched ? meta.error : undefined;

  return (
    // @ts-ignore
    <Input {...other} {...input} label={label} error={error} direction="y" className={clsx(styles.field, className)} />
  );
};

export { FormInput };
