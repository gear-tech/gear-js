import { ApiProvider, AccountProvider, useApi } from '@gear-js/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Wallet } from '../components';

import '@gear-js/vara-ui/dist/style.css';
import './index.scss';

// eslint-disable-next-line react-refresh/only-export-components
function App() {
  const { isApiReady } = useApi();

  if (!isApiReady) return null;

  return (
    <main>
      <div>
        <h1>Vara</h1>
        <Wallet />
      </div>

      <div>
        <h1>Gear</h1>
        <Wallet variant="gear" />
      </div>
    </main>
  );
}

const apiArgs = { endpoint: import.meta.env.VITE_NODE_ADDRESS };
const queryClient = new QueryClient();

const container = document.getElementById('root');
const root = createRoot(container as HTMLElement);

root.render(
  <StrictMode>
    <ApiProvider initialArgs={apiArgs}>
      <AccountProvider appName="wallet-connect">
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </AccountProvider>
    </ApiProvider>
  </StrictMode>,
);
