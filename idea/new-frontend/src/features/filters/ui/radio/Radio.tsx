import { useField } from 'formik';
import clsx from 'clsx';
import { Radio as UIRadio, RadioProps } from '@gear-js/ui';

import styles from './Radio.module.scss';

type Props = Omit<RadioProps, 'name' | 'onChange'> & {
  name: string;
};

const Radio = (props: Props) => {
  const { name, value, label, className, defaultChecked } = props;

  const [{ checked, onBlur, onChange }] = useField(name);

  return (
    <UIRadio
      name={name}
      value={value}
      label={label}
      checked={checked}
      className={clsx(styles.radio, className)}
      defaultChecked={defaultChecked}
      onBlur={onBlur}
      onChange={onChange}
    />
  );
};

export { Radio };
