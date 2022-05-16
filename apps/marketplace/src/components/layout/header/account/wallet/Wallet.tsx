import { useState } from 'react';
import { Account } from 'types';
import AccountButton from '../account-button';
import Menu from '../menu';
import styles from './Wallet.module.scss';

type Props = {
  balance: Account['balance'];
  address: string;
  name: string | undefined;
  onSwitchAccountClick: () => void;
};

function Wallet({ balance, address, name, onSwitchAccountClick }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevValue) => !prevValue);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.wallet}>
      <p className={styles.balance}>
        {balance.value} <span className={styles.currency}>{balance.unit}</span>
      </p>
      <AccountButton address={address} name={name} onClick={toggleMenu} />
      {isMenuOpen && <Menu close={closeMenu} onSwitchAccountClick={onSwitchAccountClick} />}
    </div>
  );
}

export default Wallet;
