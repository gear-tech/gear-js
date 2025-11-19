import { ApiProvider, AccountProvider, useApi } from '@gear-js/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Wallet as StyledWallet } from '../components';
import { Wallet } from '../headless';
import { StyledWallet as StyledHeadlessWallet } from '../styled';

import '@gear-js/vara-ui/dist/style.css';
import './index.scss';

// TODO: either fix only-export-components or remove rule
// eslint-disable-next-line react-refresh/only-export-components
function App() {
  const { isApiReady } = useApi();

  if (!isApiReady) return null;

  return (
    <main>
      <div>
        <h1>Vara</h1>
        <StyledWallet />
      </div>

      <div>
        <h1>Gear</h1>
        <StyledWallet theme="gear" />
      </div>

      <div>
        <h1>Headless Vara</h1>
        <StyledHeadlessWallet theme="vara" />
      </div>

      <div>
        <h1>Headless Gear</h1>
        <StyledHeadlessWallet theme="gear" />
      </div>

      <div>
        <h1>Headless</h1>

        <Wallet.Root>
          <Wallet.Balance>
            <Wallet.BalanceIcon />
            <Wallet.BalanceValue />
            <Wallet.BalanceSymbol />
          </Wallet.Balance>

          <Wallet.TriggerConnect />

          <Wallet.TriggerConnected>
            <Wallet.ConnectedAccountIcon />
            <Wallet.ConnectedAccountLabel />
          </Wallet.TriggerConnected>

          <Wallet.Dialog>
            <Wallet.WalletList>
              <Wallet.WalletItem>
                <Wallet.WalletTrigger>
                  <Wallet.WalletIcon />
                  <Wallet.WalletName />
                  <Wallet.WalletStatus />
                  <Wallet.WalletAccountsLabel />
                </Wallet.WalletTrigger>
              </Wallet.WalletItem>
            </Wallet.WalletList>

            <Wallet.AccountsList>
              <Wallet.AccountItem>
                <Wallet.AccountTrigger>
                  <Wallet.AccountIcon />
                  <Wallet.AccountLabel />
                </Wallet.AccountTrigger>

                <Wallet.CopyAccountAddressTrigger />
              </Wallet.AccountItem>
            </Wallet.AccountsList>

            <Wallet.NoWallets />
            <Wallet.NoMobileWallets />
            <Wallet.NoAccounts />

            <Wallet.ChangeWalletTrigger>
              <Wallet.ChangeWalletIcon />
              <Wallet.ChangeWalletName />
            </Wallet.ChangeWalletTrigger>

            <Wallet.LogoutTrigger />
          </Wallet.Dialog>
        </Wallet.Root>
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
