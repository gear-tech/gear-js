import { ChangeEvent, useState, useEffect } from 'react';
import { useField } from 'formik';
import clsx from 'clsx';
import { Input, Checkbox } from '@gear-js/ui/dist/esm';

import styles from '../Form.module.scss';

type Props = {
  name: string;
  label: string;
};

const FormPayloadType = ({ name, label }: Props) => {
  const [isChecked, setIsChecked] = useState(false);

  const [field, { touched, initialValue, error }, helpers] = useField(name);

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

  const showError = error && touched;

  return (
    <div className={clsx(styles.formItem, styles.field)}>
      <label htmlFor={field.name} className={styles.fieldLabel}>
        {label}
      </label>
      <div className={clsx(styles.payloadType, styles.fieldContent)}>
        <Checkbox
          type="switch"
          label="Enter type"
          checked={isChecked}
          className={styles.checkbox}
          onChange={toggleSwitch}
        />
        <Input {...field} id={field.name} disabled={!isChecked} />
      </div>
      {showError && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export { FormPayloadType };
