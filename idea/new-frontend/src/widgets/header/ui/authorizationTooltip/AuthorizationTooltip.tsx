import { CSSTransition } from 'react-transition-group';

import { ANIMATION_TIMEOUT } from 'shared/config';

import styles from './AuthorizationTooltip.module.scss';

const AuthorizationTooltip = () => (
  <CSSTransition in appear timeout={ANIMATION_TIMEOUT}>
    <div className={styles.authorizationTooltip}>
      <div className={styles.triangle} />
      <p className={styles.text}>Click here to connect your Substrate account and start working with Gear Idea</p>
    </div>
  </CSSTransition>
);

export { AuthorizationTooltip };
