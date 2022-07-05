import {
  ApiProvider as GearApiProvider,
  AlertProvider as GearAlertProvider,
  AccountProvider,
} from '@gear-js/react-hooks';
import { Alert, alertStyles } from '@gear-js/ui';
import { ComponentType, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { IPFSProvider } from 'context';
import { ADDRESS } from 'consts';

type Props = {
  children: ReactNode;
};

function ApiProvider({ children }: Props) {
  return <GearApiProvider providerAddress={ADDRESS.NODE}>{children}</GearApiProvider>;
}

function AlertProvider({ children }: Props) {
  return (
    <GearAlertProvider template={Alert} containerClassName={alertStyles.root}>
      {children}
    </GearAlertProvider>
  );
}

const providers = [BrowserRouter, AlertProvider, IPFSProvider, ApiProvider, AccountProvider];

function withProviders(Component: ComponentType) {
  return () => providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);
}

export { withProviders };
