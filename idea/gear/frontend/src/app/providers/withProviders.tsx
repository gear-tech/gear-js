import { AccountProvider as GearAccountProvider, ProviderProps } from '@gear-js/react-hooks';
import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AlertProvider } from './alert';
import { ApiProvider } from './api';
import { BlocksProvider } from './blocks';
import { ChainProvider } from './chain';
import { EventsProvider } from './events';
import { ModalProvider } from './modal';
import { OnboardingProvider } from './onboarding';
import { QueryProvider } from './query';

// eslint-disable-next-line react-refresh/only-export-components -- TODO(#1800): resolve eslint comments
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
