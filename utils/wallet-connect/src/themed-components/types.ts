import type { HTMLAttributes, Ref } from 'react';

type ThemeProps = {
  theme: 'gear' | 'vara';
};

// same as render props in base ui
type HTMLProps<T = any> = HTMLAttributes<T> & {
  ref?: Ref<T> | undefined;
};

export type { HTMLProps, ThemeProps };
