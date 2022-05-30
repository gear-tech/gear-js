import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AccountProvider } from './account';
import { AlertProvider } from './alert';
import { ApiProvider } from './api';
import { BlocksProvider } from './blocks';
import { EditorProvider } from './editor';

const providers = [BrowserRouter, AlertProvider, ApiProvider, BlocksProvider, AccountProvider, EditorProvider];

const withProviders = (Component: ComponentType) => () =>
  providers.reduceRight((children, Provider) => <Provider children={children} />, <Component />);

export * from './account';
export * from './alert';
export * from './api';
export * from './blocks';
export * from './editor';

export { providers, withProviders };
