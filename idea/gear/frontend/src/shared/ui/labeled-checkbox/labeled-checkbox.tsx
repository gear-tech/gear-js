import { InputWrapper, Checkbox, InputProps } from '@gear-js/ui';
import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

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
  const { register } = useFormContext();

  return (
    <InputWrapper size="normal" id={name} direction={direction} gap={gap} label={label} className={styles.inputWrapper}>
      <div className={styles.checkboxWrapper}>
        <Checkbox label={inputLabel} id={name} {...register(name)} />

        {children}
      </div>
    </InputWrapper>
  );
};

export { LabeledCheckbox };
