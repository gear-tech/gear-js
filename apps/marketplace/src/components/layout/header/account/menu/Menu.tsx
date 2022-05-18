import { NavLink } from 'react-router-dom';
import { buttonStyles } from '@gear-js/ui';
import clsx from 'clsx';
import styles from './Menu.module.scss';

type Props = {
  close: () => void;
  onSwitchAccountClick: () => void;
};

type LinkProps = {
  isActive: boolean;
};

function Menu({ close, onSwitchAccountClick }: Props) {
  const handleAccountSwitchClick = () => {
    onSwitchAccountClick();
    close();
  };

  const getClassName = (linkProps?: LinkProps) =>
    clsx(buttonStyles.button, buttonStyles.secondary, styles.link, linkProps?.isActive && styles.active);

  return (
    <ul className={styles.menu}>
      <li>
        <NavLink to="/me" className={getClassName} onClick={close}>
          My NFTs
        </NavLink>
      </li>
      <li>
        <NavLink to="/create" className={getClassName} onClick={close}>
          Create NFT
        </NavLink>
      </li>
      <li>
        <button type="button" className={getClassName()} onClick={handleAccountSwitchClick}>
          Switch account
        </button>
      </li>
    </ul>
  );
}

export default Menu;
