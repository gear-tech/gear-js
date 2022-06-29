import '@polkadot/api-augment'; // dot types fix, source: https://github.com/polkadot-js/api/blob/master/CHANGELOG.md#701-dec-20-2021
import { useEffect } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';

import styles from './App.module.scss';

import { routes } from 'routes';
import { nodeApi } from 'api/initApi';
import { withProviders } from 'context';
import { NODE_ADRESS_URL_PARAM } from 'consts';
import { subscribeToEvents } from 'services/ApiService';
import { useApi, useAlert, useEvents, useLoggedInAccount } from 'hooks';

import 'assets/scss/common.scss';
import 'assets/scss/index.scss';

import { Meta } from 'pages/Meta/Meta';
import { Send } from 'pages/Send/Send';
import { State } from 'pages/State/State';
import { EditorPage } from 'pages/Editor';
import { Programs } from 'pages/Programs/Programs';
import { Program } from 'pages/Program/Program';
import { Mailbox } from 'pages/Mailbox/Mailbox';
import { Message } from 'pages/Message/Message';
import { Explorer } from 'pages/Explorer/Explorer';
import { Document } from 'pages/Document/Document';
import { PageNotFound } from 'pages/PageNotFound/PageNotFound';
import { Main } from 'layout/Main/Main';
import { Loader } from 'components/blocks/Loader/Loader';
import { Header } from 'components/blocks/Header/Header';
import { Footer } from 'components/blocks/Footer/Footer';

const mainRoutes = [routes.main, routes.uploadedPrograms, routes.allPrograms, routes.messages];
const utilRoutes = [routes.privacyPolicy, routes.termsOfUse];

const Component = () => {
  const alert = useAlert();
  const events = useEvents();
  const { isApiReady } = useApi();

  const [searchParams, setSearchParams] = useSearchParams();
  useLoggedInAccount();

  useEffect(() => {
    if (isApiReady) {
      subscribeToEvents(alert);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady]);

  useEffect(() => {
    const urlNodeAddress = searchParams.get(NODE_ADRESS_URL_PARAM);

    if (!urlNodeAddress) {
      searchParams.set(NODE_ADRESS_URL_PARAM, nodeApi.address);
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // we'll get rid of multiple paths in one route anyway, so temp solution
  const getMultipleRoutes = (paths: string[], element: JSX.Element) =>
    paths.map((path) => <Route key={path} path={path} element={element} />);

  return (
    <div className={styles.app}>
      <Header />
      <Main>
        {isApiReady ? (
          <Routes>
            {getMultipleRoutes(mainRoutes, <Programs />)}
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
      </Main>
      <Footer />
    </div>
  );
};

export const App = withProviders(Component);
