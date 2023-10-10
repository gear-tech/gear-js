import { ChangeEvent, useState, useEffect } from 'react';
import { useForm, useField } from 'react-final-form';
import clsx from 'clsx';
import { Checkbox, InputWrapper, inputStyles, InputProps } from '@gear-js/ui';

import { formStyles } from '@/shared/ui/form';

type Props = {
  name: string;
  label: string;
  direction?: InputProps['direction'];
  gap?: InputProps['gap'];
  block?: boolean;
};

const FormPayloadType = ({ name, label, gap, block, direction = 'x' }: Props) => {
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
    block && inputStyles.block,
    formStyles.content,
    error && inputStyles.error,
    isDisabled && inputStyles.readOnly,
  );

  return (
    <InputWrapper
      id={name}
      size="normal"
      label={label}
      error={fieldError}
      direction={direction}
      gap={gap}
      className={clsx(formStyles.field, formStyles.gap16)}>
      <Checkbox
        type="switch"
        label="Enter type"
        checked={isChecked}
        className={formStyles.checkbox}
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
