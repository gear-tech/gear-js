import ReactDOM from 'react-dom';
import { Root } from './App';

async function init() {
  try {
    ReactDOM.render(Root, document.getElementById('root'));
  } catch (err) {
    console.log(err);
  }
}

init().catch((err) => console.error(err));
