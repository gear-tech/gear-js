import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { EthProvider } from './eth';
import { QueryProvider } from './query';
import { VaraEthApiProvider } from './vara-eth-api';

const providers = [BrowserRouter, QueryProvider, EthProvider, VaraEthApiProvider];

const withProviders = (Component: ComponentType) => () =>
  providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);

export { withProviders };
