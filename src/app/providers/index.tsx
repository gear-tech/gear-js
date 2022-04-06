import { ComponentType } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AccountProvider } from 'entities/account';

const providers = [BrowserRouter, AccountProvider];

function withProviders(Component: ComponentType) {
  return function WithProvider() {
    return providers.reduce(
      (component, Provider) => <Provider>{component}</Provider>,
      <Component />
    );
  };
}

export default withProviders;
