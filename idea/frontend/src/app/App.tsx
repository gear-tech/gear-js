import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useAccount, useApi } from '@gear-js/react-hooks';
import 'simplebar-react/dist/simplebar.min.css';

import { useChain, useEventSubscriptions, useMobileDisclaimer } from '@/hooks';
import { Menu } from '@/widgets/menu';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { MobileDisclaimer } from '@/widgets/mobileDisclaimer';
import { Routing } from '@/pages';
import { LocalStorage, NODE_ADRESS_URL_PARAM } from '@/shared/config';
import { Loader } from '@/shared/ui/loader';
import { ErrorFallback } from '@/shared/ui/errorFallback';
import { INITIAL_ENDPOINT } from '@/features/api';

import { withProviders } from './providers';
import './App.scss';

const App = withProviders(() => {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { api, isApiReady } = useApi();
  const { isAccountReady } = useAccount();
  const { isChainRequestReady } = useChain();
  const isAppReady = isApiReady && isAccountReady && isChainRequestReady;

  const { isMobileDisclaimerVisible, closeMobileDisclaimer } = useMobileDisclaimer();

  useEventSubscriptions();

  useEffect(() => {
    const urlNodeAddress = searchParams.get(NODE_ADRESS_URL_PARAM);

    if (urlNodeAddress) return;

    searchParams.set(NODE_ADRESS_URL_PARAM, isApiReady ? api.provider.endpoint : INITIAL_ENDPOINT);
    setSearchParams(searchParams, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, searchParams]);

  useEffect(() => {
    if (!isApiReady) return;

    localStorage.setItem(LocalStorage.Genesis, api.genesisHash.toHex());
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
