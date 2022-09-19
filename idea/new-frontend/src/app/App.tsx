import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccount, useApi } from '@gear-js/react-hooks';
import 'simplebar-react/dist/simplebar.min.css';

import { useApp, useEventSubscriptions } from 'hooks';
import { Menu } from 'widgets/menu';
import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';
import { Routing } from 'pages';
import { LocalStorage, NODE_ADRESS_URL_PARAM } from 'shared/config';
import { Loader } from 'shared/ui/loader';

import './App.scss';
import './yup-extended';
import { withProviders } from './providers';

const App = withProviders(() => {
  const { nodeAddress } = useApp();
  const { api, isApiReady } = useApi();
  const { isAccountReady } = useAccount();

  const [searchParams, setSearchParams] = useSearchParams();

  useEventSubscriptions();

  useEffect(() => {
    const urlNodeAddress = searchParams.get(NODE_ADRESS_URL_PARAM);

    if (!urlNodeAddress) {
      searchParams.set(NODE_ADRESS_URL_PARAM, nodeAddress);
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (isApiReady) {
      localStorage.setItem(LocalStorage.Chain, api.runtimeChain.toHuman());
      localStorage.setItem(LocalStorage.Genesis, api.genesisHash.toHex());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady]);

  return (
    <>
      <main className="main">
        <Menu />
        <div className="content">
          <Header />
          {isApiReady && isAccountReady ? <Routing /> : <Loader />}
        </div>
      </main>
      <Footer />
    </>
  );
});

export { App };
