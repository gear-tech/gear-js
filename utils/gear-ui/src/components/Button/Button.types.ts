import { ButtonHTMLAttributes } from 'react';
import { SVGComponent } from '../../types';

interface BaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: SVGComponent;
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
  icon: SVGComponent;
}

type Props = TextProps | IconProps;

export type { Props };
