import React from 'react';
import { Provider } from 'react-redux';

import App from './components/App';

import './index.scss';
import store from './store';

export const Root = (
  <Provider store={store}>
    <App />
  </Provider>
);
