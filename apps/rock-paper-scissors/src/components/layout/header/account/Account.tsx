import { useState } from 'react';
import { useAccount, Account  } from '@gear-js/react-hooks';
import { ReactComponent as UserSVG} from 'assets/images/icons/login.svg';
import { Button } from '@gear-js/ui';
import { AccountsModal } from './accounts-modal';
import { Wallet } from './wallet';

function AccountComponent() {
  const { account, accounts } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {account ? (
        <Wallet balance={account.balance} address={account.address} name={account.meta.name} onClick={openModal} />
      ) : (
        <Button text="Sign in" onClick={openModal} >
          <UserSVG />
        </Button>
      )}
      {isModalOpen && <AccountsModal accounts={accounts} close={closeModal} />}
    </>
  );
}

export { AccountComponent };
