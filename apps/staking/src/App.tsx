import { useApi, useBalanceSubscription, useLoggedInAccount } from '@gear-js/react-hooks';

import { Routing } from 'routes';
import { withProviders } from 'hocs';
import { Header, Footer, ApiLoader } from 'components';

import 'App.scss';

function Component() {
  const { isApiReady } = useApi();
  const { isLoginReady } = useLoggedInAccount();

  useBalanceSubscription();

  return (
    <>
      <Header isAccountVisible={isLoginReady} />
      <main>{isApiReady && isLoginReady ? <Routing /> : <ApiLoader />}</main>
      <Footer />
    </>
  );
}

export const App = withProviders(Component);
