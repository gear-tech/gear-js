import { AlertOptions, AlertType } from './types';

export const DEFAULT_OPTIONS: Required<Omit<AlertOptions, 'customId' | 'title'>> = {
  type: AlertType.INFO,
  style: { marginBottom: '10px' },
  isClosed: true,
  timeout: 10000,
};
