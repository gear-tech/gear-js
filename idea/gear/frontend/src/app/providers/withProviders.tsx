import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AccountProvider as GearAccountProvider, ProviderProps } from '@gear-js/react-hooks';

import { ApiProvider } from './api';
import { AlertProvider } from './alert';
import { BlocksProvider } from './blocks';
import { ModalProvider } from './modal';
import { EventsProvider } from './events';
import { ChainProvider } from './chain';
import { OnboardingProvider } from './onboarding';
import { QueryProvider } from './query';

function AccountProvider({ children }: ProviderProps) {
  return <GearAccountProvider appName="Gear Idea">{children}</GearAccountProvider>;
}

const providers = [
  BrowserRouter,
  AlertProvider,
  ApiProvider,
  AccountProvider,
  OnboardingProvider,
  ChainProvider,
  EventsProvider,
  BlocksProvider,
  QueryProvider,
  ModalProvider,
];

const withProviders = (Component: ComponentType) => () =>
  providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);

export { withProviders };
