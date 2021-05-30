import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import './App.scss';

import Header from '../Header';
import SignIn from '../SignIn';

function App() {
  return (
    <BrowserRouter>
      <div className="app"> 
        <Header/>
        <Route path='/sign-in' component={SignIn} exact/>
        
      </div>
    </BrowserRouter>
  );
}

export default App;
