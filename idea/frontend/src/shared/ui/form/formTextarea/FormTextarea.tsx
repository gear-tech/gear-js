import { useField } from 'react-final-form';
import { Textarea, TextareaProps } from '@gear-js/ui';
import clsx from 'clsx';

import styles from '../Form.module.scss';

type Props = TextareaProps & {
  name: string;
};

const FormTextarea = (props: Props) => {
  const { name, label, className, ...other } = props;

  const { input, meta } = useField(name);

  const error = meta.invalid && meta.touched ? meta.error : undefined;

  return (
    // @ts-ignore
    <Textarea
      {...other}
      {...input}
      label={label}
      error={error}
      direction="y"
      className={clsx(styles.field, className)}
    />
  );
};

export { FormTextarea };
