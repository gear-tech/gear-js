import { useState } from 'react';
import { useAccount } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import { GasWallet } from './gas-wallet';
import { SelectAccountPopup } from 'components/popups/select-account-popup';
import { TokensWallet } from './tokens-wallet';
import { AccountButton } from 'components/common/account-button';

export const AccountComponent = () => {
  const { account, accounts } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {account ? (
        <div className="flex gap-4">
          <Button text="Open Store" color="primary" className="whitespace-nowrap" />
          <TokensWallet
            balance={account.balance}
            address={account.address}
            name={account.meta.name}
            onClick={openModal}
          />
          <GasWallet balance={account.balance} address={account.address} name={account.meta.name} onClick={openModal} />
          <AccountButton address={account.address} name={account.meta.name} onClick={openModal} />
        </div>
      ) : (
        <Button text="Connect account" onClick={openModal} color="lightGreen" />
      )}
      {isModalOpen && <SelectAccountPopup accounts={accounts} close={closeModal} />}
    </>
  );
};
