import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { EthProvider } from './eth';
import { EthereumClientProvider } from './ethereum-client';
import { MirrorClientProvider } from './mirror-client';
import { QueryProvider } from './query';
import { VaraEthApiProvider } from './vara-eth-api';

const providers = [
  BrowserRouter,
  QueryProvider,
  EthProvider,
  EthereumClientProvider,
  MirrorClientProvider,
  VaraEthApiProvider,
];

const withProviders = (Component: ComponentType) => () =>
  providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);

export { withProviders };
