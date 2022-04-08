import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// TODO: check for cra ts updates, mb casting won't be needed
const container = document.getElementById('root');
const root = createRoot(container as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
