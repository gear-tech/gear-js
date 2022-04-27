import { NavLink } from 'react-router-dom';
import { useApi } from 'hooks';
import { routes } from 'routes';
import clsx from 'clsx';
import styles from './Menu.module.scss';

type Props = {
  openSidebar: () => void;
};

type ClassNameProps = {
  isActive: boolean;
};

const Menu = ({ openSidebar }: Props) => {
  const { api, isApiReady } = useApi();

  const getClassName = ({ isActive }: ClassNameProps) => clsx(styles.link, isActive && styles.active);

  const specName = api?.runtimeVersion.specName.toHuman();
  const specVersion = api?.runtimeVersion.specVersion.toHuman();

  return (
    <ul className={styles.menu}>
      <li>
        <button className={styles.sidebarBtn} onClick={openSidebar}>
          {isApiReady ? (
            <>
              <span>{localStorage.chain}</span>
              <span className={styles.runtime}>
                {specName}/{specVersion}
              </span>
            </>
          ) : (
            'Loading...'
          )}
        </button>
      </li>
      <li>
        <NavLink className={getClassName} to={routes.explorer}>
          Explorer
        </NavLink>
      </li>
      <li>
        <NavLink className={getClassName} to={routes.editor}>
          &lt;/&gt; IDE
        </NavLink>
      </li>
      <li>
        <NavLink className={getClassName} to={routes.mailbox}>
          Mailbox
        </NavLink>
      </li>
    </ul>
  );
};

export { Menu };
