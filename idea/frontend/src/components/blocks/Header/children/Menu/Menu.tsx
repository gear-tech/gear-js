import { NavLink } from 'react-router-dom';

import styles from './Menu.module.scss';
import { NAV_LINKS } from './const';

type Props = {
  chain: string;
  name: string;
  version: string;
  isApiReady: boolean;
  nodeVersion: string;
  openSidebar: () => void;
};

const Menu = ({ chain, name, version, isApiReady, nodeVersion, openSidebar }: Props) => {
  const getItems = () =>
    NAV_LINKS.map(({ to, text }) => (
      <li key={text} className={styles.navItem}>
        <NavLink className={styles.link} to={to}>
          {text}
        </NavLink>
      </li>
    ));

  return (
    <ul className={styles.menu}>
      <li className={styles.nodeInfo}>
        <button className={styles.sidebarBtn} onClick={openSidebar}>
          {isApiReady ? (
            <>
              <span>{chain}</span>
              <span className={styles.runtime}>
                {name}/{version}
              </span>
            </>
          ) : (
            'Loading...'
          )}
        </button>
        {nodeVersion && (
          <a
            rel="external noreferrer"
            href={`https://github.com/gear-tech/gear/commit/${nodeVersion}`}
            target="_blank"
            className={styles.nodeVersionLink}
          >
            {nodeVersion}
          </a>
        )}
      </li>
      {getItems()}
    </ul>
  );
};

export { Menu };
