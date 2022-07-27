import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Modal } from '@gear-js/ui';
import { Accounts } from '../accounts';

type Props = {
  accounts: InjectedAccountWithMeta[] | undefined;
  close: () => void;
};

function AccountsModal({ accounts, close }: Props) {
  return (
    <Modal heading="Connect" close={close}>
      {accounts ? (
        <Accounts list={accounts} onChange={close} />
      ) : (
        <p>
          Polkadot extension was not found or disabled. Please,{' '}
          <a href="https://polkadot.js.org/extension/" target="_blank" rel="noreferrer">
            install it
          </a>
          .
        </p>
      )}
    </Modal>
  );
}

export { AccountsModal };
