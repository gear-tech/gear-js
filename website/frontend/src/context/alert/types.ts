import { ReactNode, CSSProperties } from 'react';

export enum AlertType {
  INFO = 'info',
  ERROR = 'error',
  LOADING = 'loading',
  SUCCESS = 'success',
}

export type AlertTypes = 'info' | 'error' | 'loading' | 'success';

export type AlertOptions = {
  type?: AlertTypes;
  style?: CSSProperties;
  title?: string;
  timeout?: number;
  isClosed?: boolean;
};

export type TemplateAlertOptions = Omit<AlertOptions, 'type'>;

export type AlertInstance = {
  readonly id: string;
  readonly content: ReactNode;
  readonly options: AlertOptions;
};

export type AlertTimer = {
  id: NodeJS.Timeout;
  alertId: string;
};

export type AlertTemplateProps = {
  alert: AlertInstance;
  onClose: () => void;
};

export type AlertContainerFactory = {
  update(id: string, content: ReactNode, options?: AlertOptions): void;
  remove(id: string): void;
  info(content?: ReactNode, options?: TemplateAlertOptions): string;
  error(content?: ReactNode, options?: TemplateAlertOptions): string;
  success(content?: ReactNode, options?: TemplateAlertOptions): string;
  loading(content?: ReactNode, options?: TemplateAlertOptions): string;
};
