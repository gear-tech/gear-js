import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Modal } from '@gear-js/ui';
import { AccountsList } from 'components/common/accounts-list';

type Props = {
  accounts: InjectedAccountWithMeta[] | undefined;
  close: () => void;
};

export const SelectAccountPopup = ({ accounts, close }: Props) => (
  <Modal heading="Connect" close={close}>
    {accounts ? (
      <AccountsList list={accounts} onChange={close} />
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
