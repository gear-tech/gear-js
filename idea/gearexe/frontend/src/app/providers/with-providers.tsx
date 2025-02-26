import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { EthProvider } from './eth';
import { GearExeApiProvider } from './gear-exe-api';
import { QueryProvider } from './query';

const providers = [BrowserRouter, QueryProvider, EthProvider, GearExeApiProvider];

const withProviders = (Component: ComponentType) => () =>
  providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);

export { withProviders };
