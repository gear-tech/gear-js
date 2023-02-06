import type { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  ApiProvider as GearApiProvider,
  AlertProvider as GearAlertProvider,
  AccountProvider,
  ProviderProps,
} from '@gear-js/react-hooks';
import { Alert, alertStyles } from '@gear-js/ui';
import { AppProvider, ItemsStoreProvider, TmgProvider, TokensBalanceProvider, BattleProvider } from 'app/context';
import { ENV } from 'app/consts';

const ApiProvider = ({ children }: ProviderProps) => (
  <GearApiProvider providerAddress={ENV.NODE}>{children}</GearApiProvider>
);

const AlertProvider = ({ children }: ProviderProps) => (
  <GearAlertProvider template={Alert} containerClassName={alertStyles.root}>
    {children}
  </GearAlertProvider>
);

const providers = [
  BrowserRouter,
  AlertProvider,
  ApiProvider,
  AccountProvider,
  TmgProvider,
  TokensBalanceProvider,
  BattleProvider,
  ItemsStoreProvider,
  AppProvider,
];

export const withProviders = (Component: ComponentType) => () =>
  providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);
