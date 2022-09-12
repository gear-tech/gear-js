import { ChangeEvent, useState, useEffect } from 'react';
import { useForm, useField } from 'react-final-form';
import clsx from 'clsx';
import { Checkbox, InputWrapper, inputStyles } from '@gear-js/ui';

import { formStyles } from 'shared/ui/form';

import styles from './FormPayloadType.module.scss';

type Props = {
  name: string;
  label: string;
};

const FormPayloadType = ({ name, label }: Props) => {
  const { resetFieldState } = useForm();
  const { input, meta } = useField(name);

  const [isChecked, setIsChecked] = useState(false);

  const { invalid, touched, error } = meta;

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

  const isDisabled = !isChecked;
  const fieldError = invalid && touched ? error : undefined;

  const wrapperClassName = clsx(
    inputStyles.wrapper,
    inputStyles.normal,
    inputStyles.dark,
    error && inputStyles.error,
    isDisabled && inputStyles.readOnly,
  );

  return (
    <InputWrapper id={name} size="normal" label={label} error={fieldError} direction="y" className={formStyles.field}>
      <Checkbox
        type="switch"
        label="Enter type"
        checked={isChecked}
        className={styles.checkbox}
        onChange={toggleSwitch}
      />
      <div className={wrapperClassName}>
        <input
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...input}
          type="text"
          id={name}
          disabled={isDisabled}
          className={clsx(inputStyles.input, inputStyles.dark)}
        />
      </div>
    </InputWrapper>
  );
};

export { FormPayloadType };
