import { ReactNode } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { AnimationTimeout } from '@/shared/config';

import styles from '../Menu.module.scss';

type Props = NavLinkProps & {
  icon: ReactNode;
  text: string;
  children?: ReactNode;
  isFullWidth: boolean;
};

const NavigationItem = ({ to, icon, text, children, isFullWidth, end }: Props) => (
  <NavLink to={to} className={styles.navLink} end={end}>
    <span className={styles.icon}>{icon}</span>
    <CSSTransition in={isFullWidth} timeout={AnimationTimeout.Tiny}>
      <div className={styles.linkContent}>
        <span className={styles.linkText}>{text}</span>
        {children}
      </div>
    </CSSTransition>
  </NavLink>
);

export { NavigationItem };
