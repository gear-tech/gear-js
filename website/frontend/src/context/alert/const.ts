import { AlertOptions, AlertType } from './types';

type DefaultTemplateOptions = Required<Omit<AlertOptions, 'customId' | 'title'>>;

const DEFAULT_OPTIONS = {
  style: {
    marginBottom: '10px',
  },
  isClosed: true,
  timeout: 10000,
};

export const DEFAULT_INFO_OPTIONS: DefaultTemplateOptions = {
  ...DEFAULT_OPTIONS,
  type: AlertType.INFO,
};

export const DEFAULT_ERROR_OPTIONS: DefaultTemplateOptions = {
  ...DEFAULT_OPTIONS,
  type: AlertType.ERROR,
};

export const DEFAULT_SUCCESS_OPTIONS: DefaultTemplateOptions = {
  ...DEFAULT_OPTIONS,
  type: AlertType.SUCCESS,
};

export const DEFAULT_LOADING_OPTIONS: DefaultTemplateOptions = {
  ...DEFAULT_OPTIONS,
  type: AlertType.LOADING,
  isClosed: false,
  timeout: 0,
};
