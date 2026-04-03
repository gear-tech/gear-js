import type { InputHTMLAttributes } from 'react';

import { Radio, type RadioProps } from './Radio';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  buttons: RadioProps[];
}

const RadioGroup = ({ buttons, value, ...attrs }: Props) => {
  const getButtons = () =>
    buttons.map((button, index) => {
      const checked = value === button.value;
      const buttonAttrs = value ? { ...button, checked } : button;

      return <Radio key={index} {...{ ...buttonAttrs, ...attrs }} />;
    });

  return <>{getButtons()}</>;
};

export type { Props as RadioGroupProps };
export { RadioGroup };
