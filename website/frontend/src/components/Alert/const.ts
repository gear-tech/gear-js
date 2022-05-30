import { CSSProperties } from 'react';

export const DURATION = 250;

export const DEFAULT_STYLE: CSSProperties = {
  opacity: 0,
  transition: `opacity ${DURATION}ms ease`,
};

export const TRANSITION_STYLES: { [key: string]: CSSProperties } = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
};
