import { Button } from '@gear-js/ui';
import { SelectAccountPopup } from 'components/popups/select-account-popup';
import { CreateTamagotchiForm } from 'components/forms/create-tamagotchi-form';
import { useAccount } from '@gear-js/react-hooks';
import { useState } from 'react';

export const ConnectAccount = () => {
  const { account, accounts } = useAccount();
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <div className="flex flex-col items-center gap-9 text-center w-full">
      <div className="space-y-6">
        <h2 className="typo-h2 text-primary">Geary</h2>
        <p className="text-[#D1D1D1]">
          {account ? 'Insert program ID to create a character' : 'Connect your account to start the game'}
        </p>
      </div>
      <div className=" w-full">
        {account ? (
          <CreateTamagotchiForm />
        ) : (
          <>
            <Button text="Connect account" color="primary" onClick={openModal} />
            {open && <SelectAccountPopup accounts={accounts} close={closeModal} />}
          </>
        )}
      </div>
    </div>
  );
};
