import { CSSTransition } from 'react-transition-group';

import { ANIMATION_TIMEOUT } from 'shared/config';
import { ReactComponent as MenuSVG } from 'shared/assets/images/menu/menu.svg';

import styles from './NodesButton.module.scss';

type Props = {
  name: string;
  chain: string;
  isOpen: boolean;
  version: string;
  isApiReady: boolean;
};

const NodesButton = ({ name, chain, version, isOpen, isApiReady }: Props) => (
  <CSSTransition in={!isOpen} timeout={ANIMATION_TIMEOUT} className={styles.nodeInfoButton}>
    <button type="button">
      <p className={styles.menuIconWrapper}>
        <MenuSVG />
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
  </CSSTransition>
);

export { NodesButton };
