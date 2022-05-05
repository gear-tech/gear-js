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

const links = [
  { to: routes.explorer, text: 'Explorer' },
  { to: routes.editor, text: '</> IDE' },
  { to: routes.mailbox, text: 'Mailbox' },
];

const Menu = ({ openSidebar }: Props) => {
  const { api, isApiReady } = useApi();

  const getClassName = ({ isActive }: ClassNameProps) => clsx(styles.link, isActive && styles.active);

  const getItems = () =>
    links.map(({ to, text }) => (
      <li key={text}>
        <NavLink className={getClassName} to={to} children={text} />
      </li>
    ));

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
      {getItems()}
    </ul>
  );
};

export { Menu };
