import {
  ApiProvider as GearApiProvider,
  AlertProvider as GearAlertProvider,
  AccountProvider,
  ProviderProps,
} from '@gear-js/react-hooks';
import { Alert, alertStyles } from '@gear-js/ui';
import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ADDRESS } from 'app/consts';
import { WasmProvider } from 'app/context';

function ApiProvider({ children }: ProviderProps) {
  return <GearApiProvider providerAddress={ADDRESS.NODE}>{children}</GearApiProvider>;
}

function AlertProvider({ children }: ProviderProps) {
  return (
    <GearAlertProvider template={Alert} containerClassName={alertStyles.root}>
      {children}
    </GearAlertProvider>
  );
}

const providers = [BrowserRouter, AlertProvider, ApiProvider, AccountProvider, WasmProvider];

export const withProviders = (Component: ComponentType) => () =>
  providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);
