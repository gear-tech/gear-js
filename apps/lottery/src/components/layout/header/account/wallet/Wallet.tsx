import { Account } from '@gear-js/react-hooks';
import { AccountButton } from '../account-button';
import styles from './Wallet.module.scss';

type Props = {
  balance: Account['balance'];
  address: string;
  name: string | undefined;
  onClick: () => void;
};

function Wallet({ balance, address, name, onClick }: Props) {
  return (
    <div className={styles.wallet}>
      <p className={styles.balance}>
        {balance.value} <span className={styles.currency}>{balance.unit}</span>
      </p>
      <AccountButton address={address} name={name} onClick={onClick} />
    </div>
  );
}

export { Wallet };
