import { ReactNode, CSSProperties } from "react";

export enum AlertType {
   INFO = 'info',
   ERROR = 'error',
   LOADING = 'loading',
   SUCCESS = 'success',
};

export type AlertTypes = typeof AlertType.INFO | typeof AlertType.ERROR | typeof AlertType.LOADING | typeof AlertType.SUCCESS;

export interface AlertOptions {
   type?: AlertTypes;
   timeout?: number;
   closed?: boolean;
}

export interface AlertInstance {
   id: number;
   style?: CSSProperties,
   options: AlertOptions;
   message: string;
   show: () => void;
   close: () => void;
   update: (message: string, options?: AlertOptions) => void;
}

export interface AlertTimer {
  id: NodeJS.Timeout; 
  alertId: number;
}

export interface AlertContainerFactory {
   create(message: string, options?: AlertOptions): AlertInstance
   info(message?: ReactNode, options?: AlertOptions): AlertInstance;
   error(message?: ReactNode, options?: AlertOptions): AlertInstance;
   success(message?: ReactNode, options?: AlertOptions): AlertInstance;
   loading(message?: ReactNode, options?: AlertOptions): AlertInstance;
}