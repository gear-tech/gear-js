import '@polkadot/api-augment'; // dot types fix, source: https://github.com/polkadot-js/api/blob/master/CHANGELOG.md#701-dec-20-2021
import { useEffect } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import { Footer } from 'components/blocks/Footer/Footer';
import { PageNotFound } from 'components/pages/PageNotFound/PageNotFound';
import { Programs } from 'components/pages/Programs/Programs';
import { Program } from 'components/pages/Program/Program';
import { Mailbox } from 'components/pages/Mailbox/Mailbox';
import { Message } from 'components/pages/Message/Message';
import Explorer from 'components/pages/Explorer/Explorer';
import { Header } from 'components/blocks/Header/Header';
import { Document } from 'components/pages/Document/Document';
import { Send } from 'components/pages/Send/Send';
import { Meta } from 'components/pages/Meta/Meta';
import { EditorPage } from 'features/Editor/EditorPage/EditorPage';
import { Loader } from 'components/blocks/Loader/Loader';
import State from 'components/pages/State/State';

import { routes } from 'routes';
import { subscribeToEvents } from 'services/ApiService';
import { nodeApi } from '../../api/initApi';

import { useApi, useAlert, useEvents, useLoggedInAccount } from 'hooks';

import './App.scss';
import 'assets/scss/common.scss';
import 'assets/scss/index.scss';
import { NODE_ADRESS_URL_PARAM } from '../../consts';
import { globalStyles } from './styles';
import { Main } from 'layout/Main/Main';
import { withProviders } from 'context';

const mainRoutes = [routes.main, routes.uploadedPrograms, routes.allPrograms, routes.messages];
const utilRoutes = [routes.privacyPolicy, routes.termsOfUse];

const Component = () => {
  globalStyles();
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

  const isFooterHidden = () => {
    const locationPath = window.location.pathname.replaceAll('/', '');
    const privacyPath = routes.privacyPolicy.replaceAll('/', '');
    const termsOfUsePath = routes.termsOfUse.replaceAll('/', '');
    return locationPath === privacyPath || locationPath === termsOfUsePath;
  };

  // we'll get rid of multiple paths in one route anyway, so temp solution
  const getMultipleRoutes = (paths: string[], element: JSX.Element) =>
    paths.map((path) => <Route key={path} path={path} element={element} />);

  return (
    <div className="app">
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
      {isFooterHidden() || <Footer />}
    </div>
  );
};

export const App = withProviders(Component);
