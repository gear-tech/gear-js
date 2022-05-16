import AccountButton from '../account-button';
import styles from './Wallet.module.scss';

type Props = {
  balance: string;
  address: string;
  name: string | undefined;
  onClick: () => void;
};

function Wallet({ balance, address, name, onClick }: Props) {
  const [balanceValue, currency] = balance.split(' ');

  return (
    <>
      <p className={styles.balance}>
        {balanceValue} <span className={styles.currency}>{currency}</span>
      </p>
      <AccountButton address={address} name={name} onClick={onClick} />
    </>
  );
}

export default Wallet;
