import { ApiProvider, AccountProvider, useApi, useSendProgramTransaction, useProgram } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Wallet } from '../components';

import { SailsProgram } from './starship';

import '@gear-js/vara-ui/dist/style.css';
import './index.scss';

// TODO: either fix only-export-components or remove rule
// eslint-disable-next-line react-refresh/only-export-components
function App() {
  const { isApiReady } = useApi();

  const { data: program } = useProgram({
    id: '0x38f30c848f4dfbe7abcf982b0131512709c743e4f44a7310904765c7beb1c366',
    library: SailsProgram,
  });

  const { sendTransactionAsync } = useSendProgramTransaction({
    program,
    serviceName: 'starship',
    functionName: 'addPoints',
  });

  const handleClick = async () => {
    const result = await sendTransactionAsync({ args: [100, 0] });

    console.log('result: ', result);
  };

  if (!isApiReady) return null;

  return (
    <main>
      <div>
        <h1>Vara</h1>
        <Wallet />
      </div>

      <div>
        <h1>Gear</h1>
        <Wallet theme="gear" />
      </div>

      <div>
        <Button text="Send Tx" onClick={handleClick} />
      </div>
    </main>
  );
}

const apiArgs = { endpoint: import.meta.env.VITE_NODE_ADDRESS as string };
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
