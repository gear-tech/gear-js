import React, { useEffect } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';

import { RootState } from 'store/reducers';

import {PrivateRoute} from "components/PrivateRoute"

import './App.scss';

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

const App = () => {

  const {isProgramUploading, isMessageSending} = useSelector((state: RootState) => state.programs);

  useEffect(() => {
    if ((isProgramUploading || isMessageSending) && document.body.style.overflowY !== "hidden") {
      document.body.style.overflowY = "hidden"
    } else if (!(isProgramUploading || isMessageSending) && document.body.style.overflowY !== "unset") {
      document.body.style.overflowY = "unset"
    }  
  }, [isProgramUploading, isMessageSending]);

  const isFooterShown = () => {
    const locationPath = window.location.pathname.replaceAll('/', '');
    const privacyPath = routes.privacyPolicy.replaceAll('/', '');
    const termsOfUsePath = routes.termsOfUse.replaceAll('/', '');
    const allPrograms = routes.allPrograms.replaceAll('/', '');
    return locationPath === privacyPath || locationPath === termsOfUsePath || locationPath === allPrograms;
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
                <UploadProgramPage/>
              </PrivateRoute>
              <PrivateRoute path={routes.editor} exact>
                <EditorPage />
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
            isFooterShown()
            ||
            <Footer/>
          }
        </div>
      </BrowserRouter>
    </DndProvider>
  )
};

export default App;
