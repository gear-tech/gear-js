import Identicon from '@polkadot/react-identicon';
import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui';

import styles from './AccountButton.module.scss';

type Props = {
  name?: string;
  address: string;
  className?: string;
  onClick: () => void;
};

function AccountButton({ name, address, className, onClick }: Props) {
  const accountBtnClasses = clsx(buttonStyles.button, styles.accountBtn, className);

  return (
    <button type="button" className={accountBtnClasses} onClick={onClick}>
      <Identicon value={address} size={28} theme="polkadot" className={buttonStyles.icon} />
      <span className={styles.accountName}>{name}</span>
    </button>
  );
}

export { AccountButton };
