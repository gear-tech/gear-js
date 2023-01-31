import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
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

interface Account extends InjectedAccountWithMeta {
  decodedAddress: HexString;
  balance: { value: string; unit: string | undefined };
}

export {
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
};
