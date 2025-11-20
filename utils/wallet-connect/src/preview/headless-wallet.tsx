import { Wallet } from '@/components';

function HeadlessWallet() {
  return (
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
  );
}

export { HeadlessWallet };
