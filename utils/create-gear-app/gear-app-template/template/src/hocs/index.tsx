import {
  ApiProvider as GearApiProvider,
  AlertProvider as GearAlertProvider,
  AccountProvider,
  ProviderProps,
} from '@gear-js/react-hooks';

import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Alert } from 'components';
import { ADDRESS } from 'consts';

function ApiProvider({ children }: ProviderProps) {
  return <GearApiProvider providerAddress={ADDRESS.NODE}>{children}</GearApiProvider>;
}

function AlertProvider({ children }: ProviderProps) {
  return <GearAlertProvider template={Alert}>{children}</GearAlertProvider>;
}

const providers = [BrowserRouter, AlertProvider, ApiProvider, AccountProvider];

function withProviders(Component: ComponentType) {
  return () => providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);
}

export { withProviders };
