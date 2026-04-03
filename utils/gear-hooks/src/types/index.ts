import {
  type AlertContainerFactory,
  type AlertInstance,
  type AlertOptions,
  type AlertTemplateProps,
  type AlertTimer,
  AlertType,
  type DefaultTemplateOptions,
  type TemplateAlertOptions,
} from './alert';
import type { QueryParameters } from './query';

type ProviderProps = Omit<React.ProviderProps<never>, 'value'>;

// in case Object.entries return value is immutable
// ref: https://stackoverflow.com/a/60142095
type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type {
  AlertContainerFactory,
  AlertInstance,
  AlertOptions,
  AlertTemplateProps,
  AlertTimer,
  DefaultTemplateOptions,
  Entries,
  ProviderProps,
  QueryParameters,
  TemplateAlertOptions,
};
export { AlertType };
