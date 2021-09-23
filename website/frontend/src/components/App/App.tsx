import React, { useEffect, useRef, useState } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import { useSelector, useDispatch } from 'react-redux';

import { SocketService } from 'services/SocketService';

import { RootState } from 'store/reducers';

import {PrivateRoute} from "components/PrivateRoute";

import { getUnreadNotificationsCount, getUserDataAction } from 'store/actions/actions';

import './App.scss';
import 'assets/scss/common.scss';

import { routes } from 'routes';

import Footer from 'components/blocks/Footer';
import SignIn from 'components/pages/SignIn';
import UploadProgramPage from 'components/pages/UploadProgramPage';
import Header from 'components/blocks/Header';
import Main from 'components/layouts/Main';
import Callback from 'components/Callback';
import Logout from 'components/pages/Logout';
import LoadingPopup from 'components/LoadingPopup';
import DocumentPage from 'components/pages/DocumentPage';
import { EditorPage } from 'features/Editor/EditorPage';
import { NotificationsPage } from 'components/pages/NotificationsPage';

const App = () => {

  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.user)
  const { countUnread } = useSelector((state: RootState) => state.notifications);
  const {isProgramUploading, isMessageSending} = useSelector((state: RootState) => state.programs);
  const [isSocketsConnected, setIsSocketsConnected] = useState(false);

  const socketServiceRef = useRef<any>(null);

  useEffect(() => {
    if (!socketServiceRef.current) {
      socketServiceRef.current = new SocketService(dispatch);
    }
    if (!isSocketsConnected && socketServiceRef.current) {
      socketServiceRef.current.getTotalIssuance();
      socketServiceRef.current.subscribeNewBlocks();
      socketServiceRef.current.subscribeEvents();
      setIsSocketsConnected(true);
    }
  }, [dispatch, isSocketsConnected, setIsSocketsConnected])

  useEffect(() => {
    if ((isProgramUploading || isMessageSending) && document.body.style.overflowY !== "hidden") {
      document.body.style.overflowY = "hidden"
    } else if (!(isProgramUploading || isMessageSending) && document.body.style.overflowY !== "unset") {
      document.body.style.overflowY = "unset"
    }  
  }, [isProgramUploading, isMessageSending]);


  useEffect(() => {
    if (!user) {
      dispatch(getUserDataAction());
    }
    if (typeof countUnread !== "number") {
      dispatch(getUnreadNotificationsCount());
    }
  }, [dispatch, user, countUnread]);

  const isFooterHidden = () => {
    const locationPath = window.location.pathname.replaceAll('/', '');
    const privacyPath = routes.privacyPolicy.replaceAll('/', '');
    const termsOfUsePath = routes.termsOfUse.replaceAll('/', '');
    return locationPath === privacyPath || locationPath === termsOfUsePath;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <div className="app">
          {
            (isProgramUploading || isMessageSending)
            &&
            (
              <>
                <div className="overlay"/>
                <LoadingPopup/>
              </>
            )
          }
          <Header/>
          <Main>
            <Switch>
              <PrivateRoute exact path={[routes.main, routes.uploadedPrograms, routes.allPrograms]}>
                <UploadProgramPage socketService={socketServiceRef.current}/>
              </PrivateRoute>
              <PrivateRoute path={routes.editor} exact>
                <EditorPage />
              </PrivateRoute>
              <PrivateRoute path={routes.notifications} exact>
                <NotificationsPage socketService={socketServiceRef.current}/>
              </PrivateRoute>
              <Route exact path={routes.signIn}>
                <SignIn/>
              </Route>
              <Route exact path={[routes.privacyPolicy, routes.termsOfUse]}>
                <DocumentPage/>
              </Route>
              <Route path={routes.callback} exact>
                <Callback/>
              </Route>
              <Route path={routes.logout} exact>
                <Logout />
              </Route>
            </Switch>
          </Main>
          {
            isFooterHidden()
            ||
            <Footer/>
          }
        </div>
      </BrowserRouter>
    </DndProvider>
  )
};

export default App;
