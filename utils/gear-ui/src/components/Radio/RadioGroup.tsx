import { InputHTMLAttributes } from 'react';
import { Props as RadioProps } from './types';
import { Radio } from './Radio';

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

export { RadioGroup };
