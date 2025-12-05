import { NavLink } from 'react-router-dom';

import { cx } from '@/shared/helpers';

import { PROGRAM_TABS } from '../../consts';

import styles from './program-tabs.module.scss';

function ProgramTabs() {
  const render = () =>
    PROGRAM_TABS.map(({ id, label }, index) => (
      <NavLink
        key={id}
        to={index ? id : ''}
        className={({ isActive }) => cx(styles.button, isActive && styles.active)}
        end>
        {label}
      </NavLink>
    ));

  return <header className={styles.tabs}>{render()}</header>;
}

export { ProgramTabs };
