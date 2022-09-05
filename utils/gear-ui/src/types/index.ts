import { ReactNode } from 'react';

type Gap = `${number}/${number}`;

type BaseInputProps = {
  size?: 'normal' | 'large';
  color?: 'light' | 'dark';
  error?: ReactNode;
  tooltip?: string;
};

type XDirectionProps = BaseInputProps & { label?: string; direction?: 'x'; gap?: Gap };
type YDirectionProps = BaseInputProps & { label?: string; direction?: 'y'; gap?: never };

type InputProps = XDirectionProps | YDirectionProps;

export { Gap, InputProps };
