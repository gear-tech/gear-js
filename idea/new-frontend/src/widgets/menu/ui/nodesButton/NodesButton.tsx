import { MouseEvent } from 'react';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui';

import { AnimationTimeout } from 'shared/config';
import connectSVG from 'shared/assets/images/menu/connect.svg';

import styles from './NodesButton.module.scss';

type Props = {
  name: string;
  chain: string;
  version: string;
  isApiReady: boolean;
  isFullWidth: boolean;
  onClick: (event: MouseEvent) => void;
};

const NodesButton = ({ name, chain, version, isFullWidth, isApiReady, onClick }: Props) => {
  const btnClasses = clsx(
    buttonStyles.button,
    buttonStyles.light,
    styles.nodeInfoButton,
    isFullWidth && styles.fullWidth,
  );

  return (
    <button type="button" className={btnClasses} onClick={onClick}>
      <p className={styles.menuIconWrapper}>
        <img src={connectSVG} alt="connect" className={buttonStyles.icon} />
      </p>
      <CSSTransition in={isFullWidth} timeout={AnimationTimeout.Default} className={styles.nodeInfo} unmountOnExit>
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
