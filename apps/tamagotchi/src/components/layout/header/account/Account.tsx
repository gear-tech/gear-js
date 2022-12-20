import { useState } from 'react';
import { useAccount } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import { Wallet } from './wallet';
import { SelectAccountPopup } from 'components/popups/select-account-popup';

export const AccountComponent = () => {
  const { account, accounts } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {account ? (
        <Wallet balance={account.balance} address={account.address} name={account.meta.name} onClick={openModal} />
      ) : (
        <Button text="Connect account" onClick={openModal} color="lightGreen" />
      )}
      {isModalOpen && <SelectAccountPopup accounts={accounts} close={closeModal} />}
    </>
  );
};
