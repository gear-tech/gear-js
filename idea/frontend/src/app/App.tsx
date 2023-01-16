import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccount, useApi } from '@gear-js/react-hooks';
import 'simplebar-react/dist/simplebar.min.css';

import { useApp, useChain, useEventSubscriptions, useLocalProgramsFilter } from 'hooks';
import { Menu } from 'widgets/menu';
import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';
import { Routing } from 'pages';
import { LocalStorage, NODE_ADRESS_URL_PARAM } from 'shared/config';
import { Loader } from 'shared/ui/loader';

import './App.scss';
import { withProviders } from './providers';

const App = withProviders(() => {
  const { nodeAddress } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const { api, isApiReady } = useApi();
  const { isAccountReady } = useAccount();
  const { isChainRequestReady } = useChain();
  const isAppReady = isApiReady && isAccountReady && isChainRequestReady;

  useEventSubscriptions();
  useLocalProgramsFilter();

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
          {isAppReady ? <Routing /> : <Loader />}
        </div>
      </main>
      <Footer />
    </>
  );
});

export { App };
