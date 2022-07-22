import { NavLink } from 'react-router-dom';
import { useApi } from '@gear-js/react-hooks';

import styles from './Menu.module.scss';
import { NAV_LINKS } from './const';

type Props = {
  openSidebar: () => void;
};

const Menu = ({ openSidebar }: Props) => {
  const { api, isApiReady } = useApi();

  const getItems = () =>
    NAV_LINKS.map(({ to, text }) => (
      <li key={text} className={styles.navItem}>
        <NavLink className={styles.link} to={to}>
          {text}
        </NavLink>
      </li>
    ));

  const chain = api?.runtimeChain.toHuman();
  const specName = api?.runtimeVersion.specName.toHuman();
  const specVersion = api?.runtimeVersion.specVersion.toHuman();

  return (
    <ul className={styles.menu}>
      <li className={styles.nodeInfo}>
        <button className={styles.sidebarBtn} onClick={openSidebar}>
          {isApiReady ? (
            <>
              <span>{chain}</span>
              <span className={styles.runtime}>
                {specName}/{specVersion}
              </span>
            </>
          ) : (
            'Loading...'
          )}
        </button>
      </li>
      {getItems()}
    </ul>
  );
};

export { Menu };
