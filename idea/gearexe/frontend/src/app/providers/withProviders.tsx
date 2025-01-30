import { ComponentType } from "react";
import { BrowserRouter } from "react-router-dom";

import { QueryProvider } from "./query";
import { EthProvider } from "./eth";

const providers = [BrowserRouter, QueryProvider, EthProvider];

const withProviders = (Component: ComponentType) => () =>
  providers.reduceRight(
    (children, Provider) => <Provider>{children}</Provider>,
    <Component />
  );

export { withProviders };
