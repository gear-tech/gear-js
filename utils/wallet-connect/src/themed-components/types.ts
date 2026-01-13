import { HTMLAttributes, Ref } from 'react';

type ThemeProps = {
  theme: 'gear' | 'vara';
};

// same as render props in base ui
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HTMLProps<T = any> = HTMLAttributes<T> & {
  ref?: Ref<T> | undefined;
};

export type { ThemeProps, HTMLProps };
