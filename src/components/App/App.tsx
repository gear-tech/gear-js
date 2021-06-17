import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import './App.scss';

import Footer from '../blocks/Footer';
import SignIn from '../pages/SignIn';
import UploadProgramBlock from '../pages/UploadProgramPage';
import Header from '../blocks/Header';
import Main from '../layouts/Main';

const App = () => (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <div className="app">
          <Header/>
          <Main>
            <Route path='/' component={SignIn} exact/>
            <Route path='/sign-in' component={SignIn} exact/>
            <Route path='/upload-program' component={UploadProgramBlock} exact/>
            <Route path='/uploaded-programs'
                   render={() => <UploadProgramBlock showUploaded/>}
                   exact/>
          </Main>
          <Footer/>
        </div>
      </BrowserRouter>
    </DndProvider>
  );

export default App;
