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
  customId?: string;
  isClosed?: boolean;
};

export type TemplateAlertOptions = Omit<AlertOptions, 'type'>;

export type AlertInstance = {
  readonly id: string;
  readonly message: string;
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
  update(id: string, message: string, options?: AlertOptions): void;
  remove(id: string): void;
  info(message?: ReactNode, options?: TemplateAlertOptions): string;
  error(message?: ReactNode, options?: TemplateAlertOptions): string;
  success(message?: ReactNode, options?: TemplateAlertOptions): string;
  loading(message?: ReactNode, options?: TemplateAlertOptions): string;
};
