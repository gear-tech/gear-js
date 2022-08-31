import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui';

import { ANIMATION_TIMEOUT } from 'shared/config';
import connectSVG from 'shared/assets/images/menu/connect.svg';

import styles from './NodesButton.module.scss';

type Props = {
  name: string;
  chain: string;
  isOpen: boolean;
  version: string;
  isApiReady: boolean;
};

const NodesButton = ({ name, chain, version, isOpen, isApiReady }: Props) => (
  <button
    type="button"
    className={clsx(buttonStyles.button, buttonStyles.light, styles.nodeInfoButton, isOpen && styles.fullWidth)}>
    <p className={styles.menuIconWrapper}>
      <img src={connectSVG} alt="connect" className={buttonStyles.icon} />
    </p>
    <CSSTransition in={isOpen} timeout={ANIMATION_TIMEOUT} className={styles.nodeInfo} unmountOnExit>
      <p>
        {isApiReady ? (
          <>
            <span className={styles.chain}>{chain}</span>
            <span className={styles.otherInfo}>
              {name}/{version}
            </span>
          </>
        ) : (
          'Loading...'
        )}
      </p>
    </CSSTransition>
  </button>
);

export { NodesButton };
