import { CSSTransition } from 'react-transition-group';
import { MouseEvent } from 'react';
import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui';

import { ReactComponent as ConnectSVG } from 'shared/assets/images/menu/connect.svg';
import { AnimationTimeout } from 'shared/config';

import styles from './NodesButton.module.scss';

type Props = {
  name: string;
  chain: string;
  version: string;
  isApiReady: boolean;
  isOpen: boolean;
  isFullWidth: boolean;
  onClick: (event: MouseEvent) => void;
};

const NodesButton = ({ name, chain, version, isApiReady, isOpen, isFullWidth, onClick }: Props) => {
  const btnClasses = clsx(buttonStyles.button, buttonStyles.light, styles.nodeInfoButton, isOpen && styles.open);

  return (
    <button type="button" className={btnClasses} onClick={onClick}>
      <p className={styles.menuIconWrapper}>
        <ConnectSVG className={buttonStyles.icon} />
      </p>
      <CSSTransition in={isFullWidth} timeout={AnimationTimeout.Tiny} className={styles.nodeInfo} unmountOnExit>
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
};

export { NodesButton };
