import { FunctionComponent, ReactNode, SVGProps } from 'react';

type Gap = `${number}/${number}`;

type BaseInputProps = {
  size?: 'normal' | 'large';
  color?: 'light' | 'dark';
  error?: ReactNode;
  tooltip?: string;
  block?: boolean;
};

type XDirectionProps = BaseInputProps & { label?: string; direction?: 'x'; gap?: Gap };
type YDirectionProps = BaseInputProps & { label?: string; direction?: 'y'; gap?: never };

type InputProps = XDirectionProps | YDirectionProps;

type SVGComponent = FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;

export { Gap, InputProps, SVGComponent };
