import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ReactGA from 'react-ga4';

import { App } from '@/app/App';

import { GTM_ID } from './shared/config';

if (GTM_ID) ReactGA.initialize(GTM_ID);

const container = document.getElementById('root');
const root = createRoot(container as HTMLElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
