import { useEffect } from 'react';
import { useApi, useBalanceSubscription, useLoggedInAccount } from '@gear-js/react-hooks';
import { Routing } from 'pages';
import { Header, Footer, ApiLoader } from 'components';
import { withProviders } from 'hocs';
import { LOCAL_STORAGE } from './consts'
import 'App.scss';

function Component() {
  const { isApiReady, api } = useApi();

  // Set Genesis block
  useEffect(() => {
    if (isApiReady) {
      localStorage.setItem(LOCAL_STORAGE.GENESIS, api.genesisHash.toHex());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady]);

  useBalanceSubscription();
  useLoggedInAccount();

  return (
    <>
      <Header />
      <main>{isApiReady ? <Routing /> : <ApiLoader />}</main>
      <Footer />
    </>
  );
}

export const App = withProviders(Component);
