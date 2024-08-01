import { ReactNode, CSSProperties } from 'react';

enum AlertType {
  INFO = 'info',
  ERROR = 'error',
  LOADING = 'loading',
  SUCCESS = 'success',
}

type AlertOptions = {
  type: 'info' | 'error' | 'loading' | 'success';
  style?: CSSProperties;
  title?: string;
  timeout?: number;
  isClosed?: boolean;
};

type TemplateAlertOptions = Omit<AlertOptions, 'type'>;

type AlertInstance = {
  readonly id: string;
  readonly content: ReactNode;
  readonly options: AlertOptions;
};

type AlertTimer = Map<string, NodeJS.Timeout>;

type AlertTemplateProps = {
  alert: AlertInstance;
  close: () => void;
};

type AlertContainerFactory = {
  update(id: string, content: ReactNode, options?: AlertOptions): void;
  remove(id: string): void;
  info(content?: ReactNode, options?: TemplateAlertOptions): string;
  error(content?: ReactNode, options?: TemplateAlertOptions): string;
  success(content?: ReactNode, options?: TemplateAlertOptions): string;
  loading(content?: ReactNode, options?: TemplateAlertOptions): string;
};

type DefaultTemplateOptions = Required<Omit<AlertOptions, 'customId' | 'title'>>;

export { AlertType };

export type {
  AlertOptions,
  TemplateAlertOptions,
  AlertInstance,
  AlertTimer,
  AlertTemplateProps,
  AlertContainerFactory,
  DefaultTemplateOptions,
};
