import { ButtonHTMLAttributes, ReactNode } from 'react';

interface BaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'transparent';
  size?: 'normal' | 'small';
}

interface TextProps extends BaseProps {
  text: string;
  children?: never;
}

interface IconProps extends BaseProps {
  icon: string;
  children?: never;
}

interface ChildrenProps extends BaseProps {
  children: ReactNode;
  text?: never;
  icon?: never;
}

export type Props = TextProps | IconProps | ChildrenProps;
