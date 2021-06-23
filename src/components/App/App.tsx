import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

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

const App = () => (
  <DndProvider backend={HTML5Backend}>
    <BrowserRouter>
      <div className="app">
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
);

export default App;
