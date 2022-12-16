import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Modal } from '@gear-js/ui';
import { Accounts } from '../accounts';

type Props = {
  accounts: InjectedAccountWithMeta[] | undefined;
  close: () => void;
};

function AccountsModal({ accounts, close }: Props) {
  return (
    <Modal heading='Connect' close={close}>
      {accounts ? (
        <Accounts list={accounts} onChange={close} />
      ) : (
        <p>
          Wallet extension was not found or disconnected. Please check how to install a supported wallet and create an
          account
          {' '}
          <a href='https://wiki.gear-tech.io/docs/idea/account/create-account' target='_blank' rel='noreferrer'
             className='link-text'>
            here
          </a>.
        </p>
      )}
    </Modal>
  );
}

export { AccountsModal };
