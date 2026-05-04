import type { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { EthProvider } from './eth';
import { QueryProvider } from './query';

const providers = [BrowserRouter, QueryProvider, EthProvider];

const withProviders = (Component: ComponentType) => () =>
  // biome-ignore lint/correctness/useJsxKeyInIterable: reduceRight is not rendering a list
  providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, <Component />);

export { withProviders };
