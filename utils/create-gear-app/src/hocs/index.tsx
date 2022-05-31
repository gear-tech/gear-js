import {
  ApiProvider as GearApiProvider,
  AlertProvider as GearAlertProvider,
  AccountProvider,
} from '@gear-js/react-hooks';

import { ComponentType, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Alert } from 'components';
import { NODE_ADDRESS } from 'consts';

type Props = {
  children: ReactNode;
};

function ApiProvider({ children }: Props) {
  return <GearApiProvider providerAddress={NODE_ADDRESS}>{children}</GearApiProvider>;
}

function AlertProvider({ children }: Props) {
  return <GearAlertProvider template={Alert}>{children}</GearAlertProvider>;
}

const providers = [BrowserRouter, AlertProvider, ApiProvider, AccountProvider];

function withProviders(Component: ComponentType) {
  return () => providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);
}

export { withProviders };
