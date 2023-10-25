import { InputWrapper, Checkbox } from '@gear-js/ui';
import { ReactNode } from 'react';
import { FieldRenderProps, useField } from 'react-final-form';

import styles from './labeled-checkbox.module.scss';

type Props = {
  name: string;
  label: string;
  inputLabel: string;
  children?: ReactNode;
};

const LabeledCheckbox = ({ name, label, inputLabel, children }: Props) => {
  const field = useField(name, { type: 'checkbox' });
  const input = field.input as Omit<FieldRenderProps<HTMLInputElement>, 'type'>; // assert cuz Checkbox type is 'switch' | undefined

  return (
    <InputWrapper id={name} direction="x" size="normal" gap="1/5" label={label} className={styles.inputWrapper}>
      <div className={styles.checkboxWrapper}>
        <Checkbox label={inputLabel} {...input} />

        {children}
      </div>
    </InputWrapper>
  );
};

export { LabeledCheckbox };
