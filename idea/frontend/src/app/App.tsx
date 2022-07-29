import { useEffect } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import { useApi, useLoggedInAccount } from '@gear-js/react-hooks';

import './App.scss';
import 'yup-extended';

import { routes } from 'routes';
import { useEvents, useAccountSubscriptions } from 'hooks';
import { withProviders } from 'context';
import { NODE_API_ADDRESS } from 'context/api/const';
import { NODE_ADRESS_URL_PARAM, LOCAL_STORAGE } from 'consts';

import 'assets/scss/common.scss';
import 'assets/scss/index.scss';

import { Main } from 'pages/Main';
import { Messages } from 'pages/Messages';
import { AllPrograms } from 'pages/AllPrograms';
import { UserPrograms } from 'pages/UserPrograms';
import { Meta } from 'pages/Meta/Meta';
import { Send } from 'pages/Send/Send';
import { State } from 'pages/State';
import { EditorPage } from 'pages/Editor';
import { Program } from 'pages/Program/Program';
import { Mailbox } from 'pages/Mailbox';
import { Message } from 'pages/Message';
import { Explorer } from 'pages/Explorer/Explorer';
import { Document } from 'pages/Document/Document';
import { PageNotFound } from 'pages/PageNotFound/PageNotFound';
import { MainPageLayout } from 'layout/MainPageLayout';
import { Main as MainLayout } from 'layout/Main/Main';
import { Loader } from 'components/blocks/Loader/Loader';
import { Header } from 'components/blocks/Header/Header';
import { Footer } from 'components/blocks/Footer/Footer';

const utilRoutes = [routes.privacyPolicy, routes.termsOfUse];

const Component = () => {
  const events = useEvents();
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

  // we'll get rid of multiple paths in one route anyway, so temp solution
  const getMultipleRoutes = (paths: string[], element: JSX.Element) =>
    paths.map((path) => <Route key={path} path={path} element={element} />);

  const isInitLoaded = isApiReady && isLoginReady;

  return (
    <>
      <Header />
      <Main>
        {isInitLoaded ? (
          <Routes>
            <Route path={routes.main} element={<MainPageLayout />}>
              <Route index element={<Main />} />
              <Route path={routes.allPrograms} element={<AllPrograms />} />
              <Route path={routes.uploadedPrograms} element={<UserPrograms />} />
              <Route path={routes.messages} element={<Messages />} />
            </Route>

            {getMultipleRoutes(utilRoutes, <Document />)}

            {/* temp solution since in react-router v6 optional parameters are gone */}
            <Route path={routes.explorer}>
              <Route path="" element={<Explorer events={events} />} />
              <Route path=":blockId" element={<Explorer events={events} />} />
            </Route>
            <Route path={routes.program} element={<Program />} />
            <Route path={routes.message} element={<Message />} />
            <Route path={routes.state} element={<State />} />
            <Route path={routes.send}>
              <Route path={routes.sendMessage} element={<Send />} />
              <Route path={routes.reply} element={<Send />} />
            </Route>
            <Route path={routes.meta} element={<Meta />} />
            <Route path={routes.editor} element={<EditorPage />} />
            <Route path={routes.mailbox} element={<Mailbox />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        ) : (
          <Loader />
        )}
      </MainLayout>
      <Footer />
    </>
  );
};

export const App = withProviders(Component);
