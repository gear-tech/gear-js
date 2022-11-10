import { Modal } from '@gear-js/ui';
import { useAccount } from '@gear-js/react-hooks';
import { Accounts } from '../accounts';

type Props = {
  close: () => void;
};

function AccountsModal({ close }: Props) {
  const { accounts } = useAccount();

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
