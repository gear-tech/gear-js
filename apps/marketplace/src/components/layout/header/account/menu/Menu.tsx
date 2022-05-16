import { Link } from 'react-router-dom';
import { buttonStyles } from '@gear-js/ui';
import clsx from 'clsx';
import styles from './Menu.module.scss';

type Props = {
  close: () => void;
  onSwitchAccountClick: () => void;
};

function Menu({ close, onSwitchAccountClick }: Props) {
  const linkClassName = clsx(buttonStyles.button, buttonStyles.secondary, styles.link);

  const handleAccountSwitchClick = () => {
    onSwitchAccountClick();
    close();
  };

  return (
    <ul className={styles.menu}>
      <li>
        <Link to="/me" className={linkClassName} onClick={close}>
          My NFTs
        </Link>
      </li>
      <li>
        <Link to="/create" className={linkClassName} onClick={close}>
          Create NFT
        </Link>
      </li>
      <li>
        <button type="button" className={linkClassName} onClick={handleAccountSwitchClick}>
          Switch account
        </button>
      </li>
    </ul>
  );
}

export default Menu;
