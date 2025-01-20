import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import TagManager from 'react-gtm-module';

import { App } from '@/app/App';

import { GTM_ID } from './shared/config';

if (GTM_ID) TagManager.initialize({ gtmId: GTM_ID });

const container = document.getElementById('root');
const root = createRoot(container as HTMLElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
