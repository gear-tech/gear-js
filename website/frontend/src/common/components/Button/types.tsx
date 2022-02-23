import { ButtonHTMLAttributes } from 'react';

export enum Colors {
  SUCCESS = 'success',
  ERROR = 'error',
  MAIN = 'main',
}

interface BaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: string;
  color?: Colors;
  size?: 'normal' | 'small';
}

interface TextProps extends BaseProps {
  text: string;
}

interface IconProps extends BaseProps {
  icon: string;
}

export type Props = TextProps | IconProps;
