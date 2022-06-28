import { ButtonHTMLAttributes } from 'react';

interface BaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'tertiary' | 'transparent';
  size?: 'normal' | 'small';
  block?: boolean;
  noWrap?: boolean;
}

interface TextProps extends BaseProps {
  text: string;
}

interface IconProps extends BaseProps {
  icon: string;
}

export type Props = TextProps | IconProps;
