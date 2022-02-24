import { ButtonHTMLAttributes } from 'react';

interface BaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: string;
  color?: 'success' | 'error' | 'main';
  size?: 'normal' | 'small';
}

interface TextProps extends BaseProps {
  text: string;
}

interface IconProps extends BaseProps {
  icon: string;
}

export type Props = TextProps | IconProps;
