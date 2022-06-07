import { ChangeEvent, useState, useEffect } from 'react';
import { useField } from 'formik';
import clsx from 'clsx';
import { Input, Checkbox } from '@gear-js/ui';

import styles from './PayloadType.module.scss';

import { formStyles } from 'components/common/Form';

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
    <div className={clsx(formStyles.formItem, formStyles.field)}>
      <label htmlFor={field.name} className={formStyles.fieldLabel}>
        Payload type
      </label>
      <div className={clsx(styles.switchableField, formStyles.fieldContent)}>
        <Checkbox
          type="switch"
          label="Enter type"
          checked={isChecked}
          className={styles.checkbox}
          onChange={toggleSwitch}
        />
        <Input {...field} id={field.name} disabled={!isChecked} />
      </div>
    </div>
  );
};

export { PayloadType };
