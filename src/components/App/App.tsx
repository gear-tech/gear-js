import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import './App.scss';

import Footer from '../Footer';
import SignIn from '../SignIn';
import UploadProgramBlock from '../UploadProgramBlock';
import Header from '../Header';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <div className="app">
          <Header/>
          <main className="main">
            <Route path='/sign-in' component={SignIn} exact/>
            <Route path='/upload-program' component={UploadProgramBlock} exact/>
            <Route path='/uploaded-programs'
                   render={() => {
                     return <UploadProgramBlock showUploaded/>;
                   }}
                   exact/>
          </main>
          <Footer/>
        </div>
      </BrowserRouter>
    </DndProvider>
  );
}

export default App;
