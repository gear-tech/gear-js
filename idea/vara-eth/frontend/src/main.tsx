import { someFunctionToExport } from '@gear-js/sails-payload-form';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/app';

console.log(someFunctionToExport());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
