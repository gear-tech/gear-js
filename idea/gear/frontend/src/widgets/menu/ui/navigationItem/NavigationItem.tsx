import { ReactNode } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

import { AnimationTimeout } from '@/shared/config';
import { CSSTransitionWithRef } from '@/shared/ui';

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

    <CSSTransitionWithRef in={isFullWidth} timeout={AnimationTimeout.Tiny}>
      <div className={styles.linkContent}>
        <span className={styles.linkText}>{text}</span>
        {children}
      </div>
    </CSSTransitionWithRef>
  </NavLink>
);

export { NavigationItem };
