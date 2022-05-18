import { ReactNode, CSSProperties } from 'react';

export enum AlertType {
  INFO = 'info',
  ERROR = 'error',
  LOADING = 'loading',
  SUCCESS = 'success',
}

export type AlertTypes = 'info' | 'error' | 'loading' | 'success';

export interface AlertOptions {
  type?: AlertTypes;
  style?: CSSProperties;
  title?: string;
  timeout?: number;
  customId?: string;
  isClosed?: boolean;
}

export interface AlertInstance {
  readonly id: string;
  readonly message: string;
  readonly options: AlertOptions;
}

export interface AlertTimer {
  id: NodeJS.Timeout;
  alertId: string;
}

export interface AlertTemplateProps {
  alert: AlertInstance;
  onClose: () => void;
}

export interface AlertContainerFactory {
  show(message: string, options?: AlertOptions): string;
  update(id: string, message: string, options?: AlertOptions): void;
  remove(id: string): void;
  info(message?: ReactNode, options?: AlertOptions): string;
  error(message?: ReactNode, options?: AlertOptions): string;
  success(message?: ReactNode, options?: AlertOptions): string;
  loading(message?: ReactNode, options?: AlertOptions): string;
}
