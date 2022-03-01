import React, { FC, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useSearchParams } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { positions, Provider as AlertProvider } from 'react-alert';
import { AlertTemplate } from 'components/AlertTemplate';
import { Footer } from 'components/blocks/Footer/Footer';
import { PageNotFound } from 'components/pages/PageNotFound/PageNotFound';
import { Programs } from 'components/pages/Programs/Programs';
import { Program } from 'components/pages/Program/Program';
import { Message } from 'components/pages/Message/Message';
import Explorer from 'components/pages/Explorer/Explorer';
import { Header } from 'components/blocks/Header/Header';
import { LoadingPopup } from 'components/LoadingPopup/LoadingPopup';
import { Document } from 'components/pages/Document/Document';
import { SendMessage } from 'components/pages/SendMessage/SendMessage';
import { EditorPage } from 'features/Editor/EditorPage';
import { Loader } from 'components/blocks/Loader/Loader';
import State from 'components/pages/State/State';

import { routes } from 'routes';
import { RootState } from 'store/reducers';
import { subscribeToEvents, setApiReady } from '../../store/actions/actions';
import { nodeApi } from '../../api/initApi';
import { useEvents } from 'hooks/useEvents';
import { useBlocks } from 'hooks/useBlocks';
import store from '../../store';

import './App.scss';
import 'assets/scss/common.scss';
import 'assets/scss/index.scss';
import { NODE_ADRESS_URL_PARAM, ZIndexes } from '../../consts';
import { Alert } from '../Alerts';
import { globalStyles } from './styles';
import { Main } from 'layout/Main/Main';

// alert configuration
const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 10000,
  containerStyle: {
    zIndex: ZIndexes.alert,
    width: '100%',
    maxWidth: '600px',
    minWidth: '300px',
    margin: 'auto',
    left: 0,
    right: 0,
  },
};

const mainRoutes = [routes.main, routes.uploadedPrograms, routes.allPrograms, routes.messages];
const utilRoutes = [routes.privacyPolicy, routes.termsOfUse];

const AppComponent: FC = () => {
  globalStyles();
  useBlocks();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isApiReady } = useSelector((state: RootState) => state.api);
  const { isProgramUploading, isMessageSending } = useSelector((state: RootState) => state.programs);
  const events = useEvents();

  useEffect(() => {
    if ((isProgramUploading || isMessageSending) && document.body.style.overflowY !== 'hidden') {
      document.body.style.overflowY = 'hidden';
    } else if (!(isProgramUploading || isMessageSending) && document.body.style.overflowY !== 'unset') {
      document.body.style.overflowY = 'unset';
    }
  }, [isProgramUploading, isMessageSending]);

  useEffect(() => {
    if (!isApiReady) {
      nodeApi.init().then(() => {
        dispatch(setApiReady());
      });
    }
  }, [dispatch, isApiReady]);

  useEffect(() => {
    if (isApiReady) {
      dispatch(subscribeToEvents());
    }
  }, [dispatch, isApiReady]);

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
    <AlertProvider template={AlertTemplate} {...options}>
      <div className="app">
        {(isProgramUploading || isMessageSending) && (
          <>
            <div className="overlay" />
            <LoadingPopup />
          </>
        )}
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
              <Route path={routes.sendMessage} element={<SendMessage />} />
              <Route path={routes.editor} element={<EditorPage />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          ) : (
            <Loader />
          )}
        </Main>
        {isFooterHidden() || <Footer />}
        <Alert />
      </div>
    </AlertProvider>
  );
};

export const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <AppComponent />
    </BrowserRouter>
  </Provider>
);
