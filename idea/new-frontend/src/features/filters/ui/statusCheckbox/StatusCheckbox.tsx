import { useField } from 'formik';
import { Checkbox, CheckboxProps } from '@gear-js/ui';

import { BulbBlock, BulbStatus } from 'shared/ui/bulbBlock';

import styles from './StatusCheckbox.module.scss';

type Props = Omit<CheckboxProps, 'name' | 'value' | 'onChange'> & {
  name: string;
  value: string;
  status: BulbStatus;
};

const StatusCheckbox = (props: Props) => {
  const { name, label, value, status } = props;

  const [{ checked, onBlur, onChange }] = useField(name);

  return (
    <div className={styles.statusCheckbox}>
      <Checkbox name={name} label="" value={value} checked={checked} onBlur={onBlur} onChange={onChange} />
      <BulbBlock status={status} text={label} className={styles.text} />
    </div>
  );
};

export { StatusCheckbox };
