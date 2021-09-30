import ReactDOM from 'react-dom';
import React from 'react';
import { nodeApi } from 'api/initApi';
import { App } from './components/App/App';

async function init() {
  try {
    await nodeApi.init();
    ReactDOM.render(<App />, document.getElementById('root'));
  } catch (err) {
    console.log(err);
  }
}

init().catch((err) => console.error(err));
