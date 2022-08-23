import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AccountProvider } from '@gear-js/react-hooks';

import { ApiProvider } from './api';
import { AlertProvider } from './alert';
import { BlocksProvider } from './blocks';
import { EventsProvider } from './events';

const providers = [BrowserRouter, AlertProvider, BlocksProvider, EventsProvider, AccountProvider, ApiProvider];

const withProviders = (Component: ComponentType) => () =>
  providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);

export { withProviders };
