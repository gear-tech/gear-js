import React from 'react';
import { createRoot } from 'react-dom/client';
import App from 'app';

// TOFIX: remove ! after @types upgrade to 18.0.0
const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
