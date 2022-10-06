import { ButtonHTMLAttributes } from 'react';

interface BaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'light' | 'lightGreen' | 'gradient' | 'transparent';
  size?: 'large' | 'medium' | 'small';
  block?: boolean;
  noWrap?: boolean;
  tooltip?: string;
}

interface TextProps extends BaseProps {
  text: string;
}

interface IconProps extends BaseProps {
  icon: string;
}

type Props = TextProps | IconProps;

export type { Props };
