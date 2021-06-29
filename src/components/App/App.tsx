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

const App = () => {

  const {isProgramUploading} = useSelector((state: RootState) => state.programs);

  useEffect(() => {
    if (isProgramUploading && document.body.style.overflowY !== "hidden") {
      document.body.style.overflowY = "hidden"
    } else if (!isProgramUploading && document.body.style.overflowY !== "unset") {
      document.body.style.overflowY = "unset"
    }  
  }, [isProgramUploading]);

  return (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <div className="app">
          {
            isProgramUploading
            &&
            (
              <>
                <div className="overlay"/>
                <div className="loader"/>
              </>
            )
          }
          <Header/>
          <Main>
            <Switch>
              <PrivateRoute exact path={routes.main}>
                <UploadProgramPage showUploaded={false}/>
              </PrivateRoute>
              <PrivateRoute exact path={routes.uploadedPrograms}>
                <UploadProgramPage showUploaded/>
              </PrivateRoute>
              <Route exact path={routes.signIn}>
                <SignIn/>
              </Route>
              <Route path={routes.callback} exact>
                <Callback/>
              </Route>
              <Route path={routes.logout} exact>
                <Logout />
              </Route>
            </Switch>
          </Main>
          <Footer/>
        </div>
      </BrowserRouter>
    </DndProvider>
  )
};

export default App;
