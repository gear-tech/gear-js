import { ComponentPropsWithRef } from 'react';

import { SVGComponent } from '../../types';

type BaseProps = ComponentPropsWithRef<'button'> & {
  text?: string;
  icon?: SVGComponent;
  color?: 'primary' | 'secondary' | 'light' | 'lightGreen' | 'gradient' | 'grey' | 'transparent';
  size?: 'large' | 'medium' | 'small';
  block?: boolean;
  noWrap?: boolean;
  tooltip?: string;
  noLetterSpacing?: boolean;
};

type TextProps = BaseProps & {
  text: string;
};

type IconProps = BaseProps & {
  icon: SVGComponent;
};

type Props = TextProps | IconProps;

export type { Props };
