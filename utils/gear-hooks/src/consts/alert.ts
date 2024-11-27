import { AlertType, DefaultTemplateOptions } from '../types';

const DEFAULT_OPTIONS = {
  style: { marginBottom: '10px' },
  isClosed: true,
  timeout: 5000,
};

const DEFAULT_INFO_OPTIONS: DefaultTemplateOptions = {
  ...DEFAULT_OPTIONS,
  type: AlertType.INFO,
};

const DEFAULT_ERROR_OPTIONS: DefaultTemplateOptions = {
  ...DEFAULT_OPTIONS,
  type: AlertType.ERROR,
};

const DEFAULT_SUCCESS_OPTIONS: DefaultTemplateOptions = {
  ...DEFAULT_OPTIONS,
  type: AlertType.SUCCESS,
};

const DEFAULT_LOADING_OPTIONS: DefaultTemplateOptions = {
  ...DEFAULT_OPTIONS,
  type: AlertType.LOADING,
  isClosed: false,
  timeout: 0,
};

export {
  DEFAULT_OPTIONS,
  DEFAULT_INFO_OPTIONS,
  DEFAULT_ERROR_OPTIONS,
  DEFAULT_SUCCESS_OPTIONS,
  DEFAULT_LOADING_OPTIONS,
};
