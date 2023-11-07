import {
  useReadFullState,
  useReadWasmState,
  useSendMessage,
  useUploadProgram,
  useCreateProgram,
  useUploadCalculateGas,
  useCreateCalculateGas,
  useHandleCalculateGas,
  useReplyCalculateGas,
  useIsVoucherExists,
  useVoucherBalance,
  useVoucher,
  useBalance,
  useBalanceFormat,
  useAccount,
  useAlert,
  useApi,
  useCreateHandler,
  useSendMessageHandler,
  SendMessageOptions,
  UseSendMessageOptions,
} from './hooks';

import { withoutCommas } from './utils';

import { AccountProvider, ApiProvider, AlertProvider } from './context';

import {
  DEFAULT_OPTIONS,
  DEFAULT_INFO_OPTIONS,
  DEFAULT_ERROR_OPTIONS,
  DEFAULT_SUCCESS_OPTIONS,
  DEFAULT_LOADING_OPTIONS,
} from './consts';

import {
  AlertType,
  AlertOptions,
  TemplateAlertOptions,
  AlertInstance,
  AlertTimer,
  AlertTemplateProps,
  AlertContainerFactory,
  DefaultTemplateOptions,
  ProviderProps,
  Account,
} from './types';

export {
  useReadFullState,
  useReadWasmState,
  useSendMessage,
  useUploadProgram,
  useCreateProgram,
  useUploadCalculateGas,
  useCreateCalculateGas,
  useHandleCalculateGas,
  useReplyCalculateGas,
  useIsVoucherExists,
  useVoucherBalance,
  useVoucher,
  useBalance,
  useBalanceFormat,
  useAccount,
  useAlert,
  useApi,
  AccountProvider,
  ApiProvider,
  AlertProvider,
  useCreateHandler,
  useSendMessageHandler,
  withoutCommas,
  DEFAULT_OPTIONS,
  DEFAULT_INFO_OPTIONS,
  DEFAULT_ERROR_OPTIONS,
  DEFAULT_SUCCESS_OPTIONS,
  DEFAULT_LOADING_OPTIONS,
  AlertType,
};

export type {
  AlertOptions,
  TemplateAlertOptions,
  AlertInstance,
  AlertTimer,
  AlertTemplateProps,
  AlertContainerFactory,
  DefaultTemplateOptions,
  ProviderProps,
  Account,
  SendMessageOptions,
  UseSendMessageOptions,
};
