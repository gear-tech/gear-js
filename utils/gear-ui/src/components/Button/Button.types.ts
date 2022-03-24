import { ButtonHTMLAttributes } from 'react';

interface BaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'transparent';
  size?: 'normal' | 'small';
}

interface TextProps extends BaseProps {
  text: string;
}

interface IconProps extends BaseProps {
  icon: string;
}

export type ButtonProps = TextProps | IconProps;
