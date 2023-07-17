import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useAccount, useApi } from '@gear-js/react-hooks';
import 'simplebar-react/dist/simplebar.min.css';

import { useApp, useChain, useEventSubscriptions, useLocalProgramsFilter, useMobileDisclaimer } from 'hooks';
import { Menu } from 'widgets/menu';
import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';
import { MobileDisclaimer } from 'widgets/mobileDisclaimer';
import { Routing } from 'pages';
import { LocalStorage, NODE_ADRESS_URL_PARAM } from 'shared/config';
import { Loader } from 'shared/ui/loader';
import { ErrorFallback } from 'shared/ui/errorFallback';

import { withProviders } from './providers';
import './App.scss';

const App = withProviders(() => {
  const { nodeAddress } = useApp();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { api, isApiReady } = useApi();
  const { isAccountReady } = useAccount();
  const { isChainRequestReady } = useChain();
  const isAppReady = isApiReady && isAccountReady && isChainRequestReady;

  const { isMobileDisclaimerVisible, closeMobileDisclaimer } = useMobileDisclaimer();

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

          {/* key to reset on route change */}
          <ErrorBoundary key={pathname} fallbackRender={ErrorFallback}>
            {isAppReady ? <Routing /> : <Loader />}
          </ErrorBoundary>
        </div>

        {isMobileDisclaimerVisible && <MobileDisclaimer onCloseButtonClick={closeMobileDisclaimer} />}
      </main>
      <Footer />
    </>
  );
});

export { App };
