import { ApiProvider as GearApiProvider, AccountProvider } from '@gear-js/react-hooks';
import { NODE_ADDRESS } from 'consts';
import { ComponentType, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

type Props = {
  children: ReactNode;
};

function ApiProvider({ children }: Props) {
  return <GearApiProvider providerAddress={NODE_ADDRESS}>{children}</GearApiProvider>;
}

const providers = [BrowserRouter, ApiProvider, AccountProvider];

function withProviders(Component: ComponentType) {
  return () => providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);
}

export { withProviders };
