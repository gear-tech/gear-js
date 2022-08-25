import { useApi, useLoggedInAccount } from '@gear-js/react-hooks';

import { useAccountSubscriptions } from 'hooks';
import { Routing } from 'pages';
import { Menu } from 'widgets/menu';

import './App.scss';
import { withProviders } from './providers';

const App = withProviders(() => {
  const { isApiReady } = useApi();
  const { isLoginReady } = useLoggedInAccount();

  useAccountSubscriptions();

  return (
    <>
      <Menu />
      {isApiReady && isLoginReady ? <Routing /> : null}
    </>
  );
});

export { App };
