import { CSSProperties, ReactNode } from 'react';

type Options = {
  type: 'info' | 'error' | 'loading' | 'success';
  style?: CSSProperties;
  title?: string;
  timeout?: number;
  isClosed?: boolean;
};

type Alert = {
  id: string;
  content: ReactNode;
  options: Options;
};

type Props = {
  alert: Alert;
  close: () => void;
};

export type { Props };
