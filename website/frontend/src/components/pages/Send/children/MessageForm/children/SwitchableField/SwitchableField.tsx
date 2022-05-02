import { ChangeEvent, useState } from 'react';
import { useField } from 'formik';
import { Input, Checkbox } from '@gear-js/ui';

import styles from './SwitchableField.module.scss';

type Props = {
  name: string;
  label: string;
  defaultValue: string;
};

const SwitchableField = (props: Props) => {
  const { name, label, defaultValue } = props;

  const [field, , helpers] = useField(name);
  const [isChecked, setIsChecked] = useState(false);

  const toggleSwitch = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    if (!checked) {
      helpers.setValue(defaultValue);
    }

    setIsChecked(checked);
  };

  return (
    <div className={styles.switchableFieldWrapper}>
      <Checkbox type="switch" label={label} checked={isChecked} className={styles.field} onChange={toggleSwitch} />
      <Input {...field} id={name} className={styles.field} disabled={!isChecked} />
    </div>
  );
};

export { SwitchableField };
