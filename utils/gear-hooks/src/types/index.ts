import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { HexString } from '@polkadot/util/types';
import {
  AlertType,
  AlertOptions,
  TemplateAlertOptions,
  AlertInstance,
  AlertTimer,
  AlertTemplateProps,
  AlertContainerFactory,
  DefaultTemplateOptions,
} from './alert';

type ProviderProps = Omit<React.ProviderProps<never>, 'value'>;

type Account = InjectedAccountWithMeta & {
  decodedAddress: HexString;
};

export { AlertType };
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
};
