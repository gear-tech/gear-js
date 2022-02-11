import React, { FC, useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { positions, Provider as AlertProvider } from 'react-alert';
import { UnsubscribePromise } from '@polkadot/api/types';
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
import { NotificationsPage } from 'components/pages/Notifications/NotificationsPage';
import { Loader } from 'components/blocks/Loader/Loader';
import State from 'components/pages/State/State';

import { routes } from 'routes';
import { RootState } from 'store/reducers';
import { subscribeToEvents, setApiReady, fetchBlockAction } from '../../store/actions/actions';
import { nodeApi } from '../../api/initApi';
import { useApi } from 'hooks/useApi';
import store from '../../store';
import { getEvents } from 'utils/events-list';
import { Events } from 'types/events-list';

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
  timeout: 5000,
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

const AppComponent: FC = () => {
  globalStyles();
  const [api] = useApi();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { isApiReady } = useSelector((state: RootState) => state.api);
  const { isProgramUploading, isMessageSending } = useSelector((state: RootState) => state.programs);
  const [events, setEvents] = useState<Events>([]);

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
    const { search } = location;
    const searchParams = new URLSearchParams(search);
    const urlNodeAddress = searchParams.get(NODE_ADRESS_URL_PARAM);

    if (!urlNodeAddress) {
      searchParams.set(NODE_ADRESS_URL_PARAM, nodeApi.address);
      history.replace({ search: searchParams.toString() });
    }
  }, [history, location]);

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (api) {
      unsub = api.gearEvents.subscribeToNewBlocks(async (header) => {
        const { hash, number } = header;

        const timestamp = await api.blocks.getBlockTimestamp(hash);
        const date = new Date(timestamp.toNumber());

        dispatch(
          fetchBlockAction({
            hash: hash.toHex(),
            number: number.toNumber(),
            time: date.toLocaleTimeString(),
          })
        );
      });
    }
    return () => {
      if (unsub) {
        (async () => {
          (await unsub)();
        })();
      }
    };
  }, [api, dispatch]);

  useEffect(() => {
    let unsub: UnsubscribePromise | undefined;

    if (api) {
      unsub = api.allEvents((eventRecords) => {
        const newEvents = getEvents(eventRecords);
        setEvents((prevEvents) => [...newEvents, ...prevEvents]);
      });
    }

    return () => {
      if (unsub) {
        (async () => {
          (await unsub)();
        })();
      }
    };
  }, [api, dispatch]);

  const isFooterHidden = () => {
    const locationPath = window.location.pathname.replaceAll('/', '');
    const privacyPath = routes.privacyPolicy.replaceAll('/', '');
    const termsOfUsePath = routes.termsOfUse.replaceAll('/', '');
    return locationPath === privacyPath || locationPath === termsOfUsePath;
  };

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
            <Switch>
              <Route exact path={[routes.main, routes.uploadedPrograms, routes.allPrograms, routes.messages]}>
                <Programs />
              </Route>
              <Route exact path={routes.program}>
                <Program />
              </Route>
              <Route exact path={routes.explorer}>
                <Explorer events={events} />
              </Route>
              <Route exact path={routes.message}>
                <Message />
              </Route>
              <Route exact path={routes.state}>
                <State />
              </Route>
              <Route exact path={routes.sendMessage}>
                <SendMessage />
              </Route>
              <Route exact path={routes.editor}>
                <EditorPage />
              </Route>
              <Route exact path={routes.notifications}>
                <NotificationsPage />
              </Route>
              <Route exact path={[routes.privacyPolicy, routes.termsOfUse]}>
                <Document />
              </Route>
              <Route exact path="*">
                <PageNotFound />
              </Route>
            </Switch>
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
