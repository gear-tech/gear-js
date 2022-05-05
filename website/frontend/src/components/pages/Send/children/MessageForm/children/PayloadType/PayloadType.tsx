import { ChangeEvent, useState, useEffect } from 'react';
import { useField } from 'formik';
import { Input, Checkbox } from '@gear-js/ui';

import styles from './PayloadType.module.scss';

const PayloadType = () => {
  const [isChecked, setIsChecked] = useState(false);

  const [field, { touched, initialValue }, helpers] = useField('payloadType');

  const toggleSwitch = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    setIsChecked(checked);
  };

  useEffect(() => {
    if (!isChecked && touched) {
      helpers.setValue(initialValue);
      helpers.setTouched(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChecked, touched]);

  return (
    <div className={styles.switchableFieldWrapper}>
      <Checkbox type="switch" label="Enter type" checked={isChecked} className={styles.field} onChange={toggleSwitch} />
      <Input {...field} id={field.name} className={styles.field} disabled={!isChecked} />
    </div>
  );
};

export { PayloadType };
