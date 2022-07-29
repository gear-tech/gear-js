import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApi, useLoggedInAccount } from '@gear-js/react-hooks';

import './App.scss';
import 'yup-extended';
import { AppRoutes } from './children/AppRoutes';

import { useAccountSubscriptions } from 'hooks';
import { withProviders } from 'context';
import { NODE_API_ADDRESS } from 'context/api/const';
import { NODE_ADRESS_URL_PARAM, LOCAL_STORAGE } from 'consts';

import 'assets/scss/common.scss';
import 'assets/scss/index.scss';

import { Main } from 'layout/Main/Main';
import { Loader } from 'components/blocks/Loader/Loader';
import { Header } from 'components/blocks/Header/Header';
import { Footer } from 'components/blocks/Footer/Footer';

const Component = () => {
  const { api, isApiReady } = useApi();

  const [searchParams, setSearchParams] = useSearchParams();

  const { isLoginReady } = useLoggedInAccount();

  useAccountSubscriptions();

  useEffect(() => {
    const urlNodeAddress = searchParams.get(NODE_ADRESS_URL_PARAM);

    if (!urlNodeAddress) {
      searchParams.set(NODE_ADRESS_URL_PARAM, NODE_API_ADDRESS);
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (isApiReady) {
      localStorage.setItem(LOCAL_STORAGE.CHAIN, api.runtimeChain.toHuman());
      localStorage.setItem(LOCAL_STORAGE.GENESIS, api.genesisHash.toHex());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady]);

  const isInitLoaded = isApiReady && isLoginReady;

  return (
    <>
      <Header />
      <Main>{isInitLoaded ? <AppRoutes /> : <Loader />}</Main>
      <Footer />
    </>
  );
};

export const App = withProviders(Component);
