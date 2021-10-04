import React, { FC, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { AlertComponentPropsWithStyle, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { PrivateRoute } from 'components/PrivateRoute/PrivateRoute';
import { Footer } from 'components/blocks/Footer/Footer';
import { SignIn } from 'components/pages/SignIn/SignIn';
import { Programs } from 'components/pages/Programs/Programs';
import { Header } from 'components/blocks/Header/Header';
import { Main } from 'components/layouts/Main/Main';
import { Callback } from 'components/Callback/Callback';
import { Logout } from 'components/pages/Logout/Logout';
import { LoadingPopup } from 'components/LoadingPopup/LoadingPopup';
import { Document } from 'components/pages/Document/Document';
import { EditorPage } from 'features/Editor/EditorPage';
import { NotificationsPage } from 'components/pages/Notifications/NotificationsPage';

import { routes } from 'routes';
import { RootState } from 'store/reducers';
import { getUnreadNotificationsCount, getUserDataAction } from 'store/actions/actions';
import store from '../../store';

import './App.scss';
import 'assets/scss/common.scss';
import 'assets/scss/index.scss';
import { AppContextProvider } from '../../contexts/AppContext/AppContextProvider';

// alert configuration
const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  containerStyle: {
    zIndex: 999
  }
};

const AppComponent: FC = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.user);
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
    if (!user) {
      dispatch(getUserDataAction());
    }
    if (typeof countUnread !== 'number') {
      dispatch(getUnreadNotificationsCount());
    }
  }, [dispatch, user, countUnread]);

  const isFooterHidden = () => {
    const locationPath = window.location.pathname.replaceAll('/', '');
    const privacyPath = routes.privacyPolicy.replaceAll('/', '');
    const termsOfUsePath = routes.termsOfUse.replaceAll('/', '');
    return locationPath === privacyPath || locationPath === termsOfUsePath;
  };

  return (
    <BrowserRouter>
      <AppContextProvider>
        {/* TODO: find out how to provide type without as */}
        <AlertProvider template={AlertTemplate as React.ComponentType<AlertComponentPropsWithStyle>} {...options}>
          <div className="app">
            {(isProgramUploading || isMessageSending) && (
              <>
                <div className="overlay" />
                <LoadingPopup />
              </>
            )}
            <Header />
            <Main>
              <Switch>
                <PrivateRoute exact path={[routes.main, routes.uploadedPrograms, routes.allPrograms]}>
                  <Programs />
                </PrivateRoute>
                <PrivateRoute path={routes.editor} exact>
                  <EditorPage />
                </PrivateRoute>
                <PrivateRoute path={routes.notifications} exact>
                  <NotificationsPage />
                </PrivateRoute>
                <Route exact path={routes.signIn}>
                  <SignIn />
                </Route>
                <Route exact path={[routes.privacyPolicy, routes.termsOfUse]}>
                  <Document />
                </Route>
                <Route path={routes.callback} exact>
                  <Callback />
                </Route>
                <Route path={routes.logout} exact>
                  <Logout />
                </Route>
              </Switch>
            </Main>
            {isFooterHidden() || <Footer />}
          </div>
        </AlertProvider>
      </AppContextProvider>
    </BrowserRouter>
  );
};

export const App = () => (
  <Provider store={store}>
    <AppComponent />
  </Provider>
);
