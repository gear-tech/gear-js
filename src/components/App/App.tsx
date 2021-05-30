import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import './App.scss';

import Footer from '../Footer';
import SignIn from '../SignIn';
import UploadProgramBlock from '../UploadProgramBlock';
import Header from '../Header';

function App() {
  return (
    <BrowserRouter>
      <div className="app"> 
        <Header/>
        <main className="main">
          <Route path='/sign-in' component={SignIn} exact/>
          <Route path='/upload-program' component={UploadProgramBlock} exact/>
        </main>
        <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default App;
