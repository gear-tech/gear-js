import { ChangeEvent, useState, useEffect } from 'react';
import { useForm, useField } from 'react-final-form';
import clsx from 'clsx';
import { Input, Checkbox } from '@gear-js/ui';

import styles from '../Form.module.scss';

type Props = {
  name: string;
  label: string;
};

const FormPayloadType = ({ name, label }: Props) => {
  const { resetFieldState } = useForm();
  const { input, meta } = useField(name);

  const [isChecked, setIsChecked] = useState(false);

  const { invalid, touched, error } = meta;
  // const [field, { touched, initialValue, error }, helpers] = useField(name);

  const toggleSwitch = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    setIsChecked(checked);
  };

  useEffect(() => {
    if (!isChecked && touched) {
      resetFieldState(name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChecked, touched]);

  const fieldError = invalid && touched ? error : undefined;

  return (
    <div className={clsx(styles.formItem, styles.field)}>
      <label htmlFor={name} className={styles.fieldLabel}>
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
        <Input {...input} id={name} disabled={!isChecked} />
      </div>
      {fieldError && <div className={styles.error}>{fieldError}</div>}
    </div>
  );
};

export { FormPayloadType };
