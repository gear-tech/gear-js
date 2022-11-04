import { Button } from '@gear-js/ui';
import { CSSTransition } from 'react-transition-group';

import { AnimationTimeout } from 'shared/config';
import { ReactComponent as closeSVG } from 'shared/assets/images/actions/close.svg';

import styles from './AuthorizationTooltip.module.scss';

type Props = {
  onCloseButtonClick: () => void;
};

const AuthorizationTooltip = ({ onCloseButtonClick }: Props) => (
  <CSSTransition in appear timeout={AnimationTimeout.Default}>
    <div className={styles.authorizationTooltip}>
      <p className={styles.text}>Click here to connect your Substrate account and start working with Gear Idea</p>
      <Button icon={closeSVG} className={styles.button} color="transparent" onClick={onCloseButtonClick} />
    </div>
  </CSSTransition>
);

export { AuthorizationTooltip };
