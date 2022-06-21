import ReactDOM from 'react-dom';

import { App } from './components/App/App';

async function init() {
  try {
    ReactDOM.render(<App />, document.getElementById('root'));
  } catch (err) {
    console.log(err);
  }
}

init().catch((err) => console.error(err));
