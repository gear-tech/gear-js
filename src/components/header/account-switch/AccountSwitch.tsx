import { useEffect, useState } from 'react';
import useAccount from 'hooks';
import useAccounts from './hooks';
import isLoggedIn from './utils';
import Account from './account';
import AccountsModal from './accounts-modal';

function AccountSwitch() {
  const { setAccount } = useAccount();
  const accounts = useAccounts();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (accounts) setAccount(accounts.find(isLoggedIn));
  }, [accounts, setAccount]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Account onClick={openModal} />
      {isModalOpen && <AccountsModal accounts={accounts} close={closeModal} />}
    </>
  );
}

export default AccountSwitch;
