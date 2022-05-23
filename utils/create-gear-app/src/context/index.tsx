import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AccountContext, AccountProvider } from './Account';
// import AlertProvider from './Alert';
import { ApiContext, ApiProvider } from './Api';
// import { IPFSContext, IPFSProvider } from './IPFS';
// import { LoadingContext, LoadingProvider } from './Loading';

const providers = [BrowserRouter, ApiProvider, AccountProvider];

function withProviders(Component: ComponentType) {
  return () => providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);
}

export { AccountContext, ApiContext, withProviders };
