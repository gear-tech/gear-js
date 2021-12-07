import React, { FC, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { positions, Provider as AlertProvider } from 'react-alert';
import { AlertTemplate } from 'components/AlertTemplate';
import { Footer } from 'components/blocks/Footer/Footer';
import { Programs } from 'components/pages/Programs/Programs';
import { Program } from 'components/pages/Program/Program';
import { Header } from 'components/blocks/Header/Header';
import { Main } from 'components/layouts/Main/Main';
import { LoadingPopup } from 'components/LoadingPopup/LoadingPopup';
import { Document } from 'components/pages/Document/Document';
import { EditorPage } from 'features/Editor/EditorPage';
import { NotificationsPage } from 'components/pages/Notifications/NotificationsPage';
import { SimpleLoader } from 'components/blocks/SimpleLoader';

import { routes } from 'routes';
import { RootState } from 'store/reducers';
import { getUnreadNotificationsCount } from 'store/actions/actions';
import { subscribeToEvents, setApiReady } from '../../store/actions/actions';
import { nodeApi } from '../../api/initApi';
import store from '../../store';

import './App.scss';
import 'assets/scss/common.scss';
import 'assets/scss/index.scss';
import { ZIndexes } from '../../consts';
import { Alert } from '../Alerts';

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
  const dispatch = useDispatch();

  const { isApiReady } = useSelector((state: RootState) => state.api);
  const { countUnread } = useSelector((state: RootState) => state.notifications);
  const { isProgramUploading, isMessageSending } = useSelector((state: RootState) => state.programs);

  useEffect(() => {
    if ((isProgramUploading || isMessageSending) && document.body.style.overflowY !== 'hidden') {
      document.body.style.overflowY = 'hidden';
    } else if (!(isProgramUploading || isMessageSending) && document.body.style.overflowY !== 'unset') {
      document.body.style.overflowY = 'unset';
    }
  }, [isProgramUploading, isMessageSending]);

  useEffect(() => {
    if (typeof countUnread !== 'number') {
      dispatch(getUnreadNotificationsCount());
    }
  }, [dispatch, countUnread]);

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

  const isFooterHidden = () => {
    const locationPath = window.location.pathname.replaceAll('/', '');
    const privacyPath = routes.privacyPolicy.replaceAll('/', '');
    const termsOfUsePath = routes.termsOfUse.replaceAll('/', '');
    return locationPath === privacyPath || locationPath === termsOfUsePath;
  };

  return (
    <BrowserRouter>
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
                <Route exact path={[routes.main, routes.uploadedPrograms, routes.allPrograms]}>
                  <Programs />
                </Route>
                <Route exact path={routes.program}>
                  <Program />
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
              </Switch>
            ) : (
              <SimpleLoader />
            )}
          </Main>
          {isFooterHidden() || <Footer />}
          <Alert />
        </div>
      </AlertProvider>
    </BrowserRouter>
  );
};

export const App = () => (
  <Provider store={store}>
    <AppComponent />
  </Provider>
);
