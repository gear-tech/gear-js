// import { useApi, useLoggedInAccount } from '@gear-js/react-hooks';

import { useAccountSubscriptions } from 'shared/hooks';

import './App.scss';
import { withProviders } from './providers';

const Component = () => {
  // const { isApiReady } = useApi();
  // const { isLoginReady } = useLoggedInAccount();

  useAccountSubscriptions();

  return null;
};

export const App = withProviders(Component);
