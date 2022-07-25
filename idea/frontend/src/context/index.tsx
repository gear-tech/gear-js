import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AccountProvider } from '@gear-js/react-hooks';

import { ApiProvider } from './api';
import { AlertProvider } from './alert';
import { BlocksProvider } from './blocks';
import { EditorProvider } from './editor';

const providers = [BrowserRouter, AlertProvider, ApiProvider, BlocksProvider, AccountProvider, EditorProvider];

const withProviders = (Component: ComponentType) => () =>
  providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);

export * from './blocks';
export * from './editor';

export { providers, withProviders };
