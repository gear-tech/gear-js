import { ReactNode } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import styles from './NavigationItem.module.scss';
import { ANIMATION_TIMEOUT } from '../../model/consts';

type Props = NavLinkProps & {
  icon: ReactNode;
  text: string;
  content?: ReactNode;
  isFullWidth: boolean;
};

const NavigationItem = ({ to, icon, text, content, isFullWidth }: Props) => (
  <NavLink to={to} className={styles.navLink}>
    <span className={styles.icon}>{icon}</span>
    <CSSTransition in={isFullWidth} timeout={ANIMATION_TIMEOUT} className={styles.linkContent} unmountOnExit>
      <span>
        <span className={styles.linkText}>{text}</span>
        {content}
      </span>
    </CSSTransition>
  </NavLink>
);

export { NavigationItem };
