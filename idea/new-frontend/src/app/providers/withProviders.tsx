import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AccountProvider } from '@gear-js/react-hooks';

import { ApiProvider } from './api';
import { AlertProvider } from './alert';
import { BlocksProvider } from './blocks';
import { ModalProvider } from './modal';
import { EventsProvider } from './events';

const providers = [
  BrowserRouter,
  ApiProvider,
  AccountProvider,
  EventsProvider,
  BlocksProvider,
  ModalProvider,
  AlertProvider,
];

const withProviders = (Component: ComponentType) => () =>
  providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);

export { withProviders };
