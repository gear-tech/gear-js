import { Button } from '@gear-js/ui';
import { SelectAccountPopup } from '../../popups/select-account-popup';
import { useState } from 'react';
import { useAccount } from '@gear-js/react-hooks';

export const LoginSection = () => {
  const { accounts } = useAccount();
  const [open, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <>
      <Button text="Connect account" color="primary" onClick={openModal} />
      {open && <SelectAccountPopup accounts={accounts} close={closeModal} />}
    </>
  );
};
