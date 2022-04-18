import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AccountProvider, AccountContext } from './account';
import { AlertProvider } from './alert';
import { ApiProvider, ApiContext } from './api';
import { BlocksProvider, BlocksContext } from './blocks';
import { EditorProvider, EditorContext } from './editor';
import { LoadingProvider, LoadingContext } from './loading';

const providers = [
  BrowserRouter,
  AlertProvider,
  ApiProvider,
  BlocksProvider,
  AccountProvider,
  EditorProvider,
  LoadingProvider,
];

const withProviders = (Component: ComponentType) => () =>
  providers.reduceRight((children, Provider) => <Provider children={children} />, <Component />);

export { withProviders, AccountContext, ApiContext, BlocksContext, EditorContext, LoadingContext };
