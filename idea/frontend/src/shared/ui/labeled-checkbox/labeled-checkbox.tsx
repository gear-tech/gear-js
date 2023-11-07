import { InputWrapper, Checkbox, InputProps } from '@gear-js/ui';
import { ReactNode } from 'react';
import { FieldRenderProps, useField } from 'react-final-form';

import styles from './labeled-checkbox.module.scss';

type Props = {
  name: string;
  label: string;
  inputLabel: string;
  direction?: InputProps['direction'];
  gap?: InputProps['gap'];
  children?: ReactNode;
};

const LabeledCheckbox = ({ name, label, inputLabel, direction = 'x', gap, children }: Props) => {
  const field = useField(name, { type: 'checkbox' });
  const input = field.input as Omit<FieldRenderProps<HTMLInputElement>, 'type'>; // assert cuz Checkbox type is 'switch' | undefined

  return (
    <InputWrapper size="normal" id={name} direction={direction} gap={gap} label={label} className={styles.inputWrapper}>
      <div className={styles.checkboxWrapper}>
        <Checkbox label={inputLabel} {...input} />

        {children}
      </div>
    </InputWrapper>
  );
};

export { LabeledCheckbox };
