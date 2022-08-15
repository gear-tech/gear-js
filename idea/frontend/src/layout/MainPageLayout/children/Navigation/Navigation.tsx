import { NavLink } from 'react-router-dom';

import styles from './Navigation.module.scss';

import { routes } from 'routes';
import { BlocksSummary } from 'components/BlocksSummary/BlocksSummary';

const Navigation = () => (
  <div className={styles.programSwitch}>
    <div className={styles.switchButtons}>
      <NavLink to={routes.main} className={styles.switchButton}>
        Main
      </NavLink>
      <NavLink to={routes.uploadedPrograms} className={styles.switchButton}>
        My programs
      </NavLink>
      <NavLink to={routes.allPrograms} className={styles.switchButton}>
        All programs
      </NavLink>
      <NavLink to={routes.messages} className={styles.switchButton}>
        Messages
      </NavLink>
    </div>
    <BlocksSummary />
  </div>
);

export { Navigation };
