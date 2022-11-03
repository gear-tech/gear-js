import { ChangeEvent } from 'react';
import { useField, useForm } from 'react-final-form';
import { Checkbox as UICheckbox, CheckboxProps } from '@gear-js/ui';

type Props = Omit<CheckboxProps, 'name' | 'value' | 'onChange'> & {
  name: string;
  value: string;
};

const Checkbox = ({ name, label, value }: Props) => {
  const { input } = useField(name, { type: 'checkbox', value });
  const { submit } = useForm();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    input.onChange(event);
    submit();
  };
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <UICheckbox {...input} type={undefined} label={label} onChange={handleChange} />;
};

export { Checkbox };
