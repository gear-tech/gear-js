import { CSSTransition } from 'react-transition-group';

import { AnimationTimeout } from 'shared/config';
import menuSVG from 'shared/assets/images/menu/menu.svg';

import styles from './NodeInfo.module.scss';

type Props = {
  name: string;
  chain: string;
  isOpen: boolean;
  version: string;
  isApiReady: boolean;
};

const NodeInfo = ({ name, chain, version, isOpen, isApiReady }: Props) => (
  <CSSTransition in={!isOpen} timeout={AnimationTimeout.Default} className={styles.nodeInfoButton}>
    <button type="button">
      <p className={styles.menuIconWrapper}>
        <img src={menuSVG} alt="menu" />
      </p>
      <CSSTransition in={isOpen} timeout={AnimationTimeout.Default} className={styles.nodeInfo} unmountOnExit>
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

export { NodeInfo };
