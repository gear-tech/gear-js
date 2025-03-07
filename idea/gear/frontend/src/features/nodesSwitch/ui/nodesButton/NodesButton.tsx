import { buttonStyles } from '@gear-js/ui';
import clsx from 'clsx';
import { MouseEvent } from 'react';

import { useNetworkIcon } from '@/hooks';
import { AnimationTimeout } from '@/shared/config';
import { CSSTransitionWithRef } from '@/shared/ui';

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
  const { NetworkSVG } = useNetworkIcon();

  const btnClasses = clsx(buttonStyles.button, buttonStyles.light, styles.nodeInfoButton, isOpen && styles.open);

  return (
    <button type="button" className={btnClasses} onClick={onClick}>
      {/* TODO: NetworkIcon component, same as in ./Node */}
      <NetworkSVG className={styles.icon} />

      <CSSTransitionWithRef in={isFullWidth} timeout={AnimationTimeout.Tiny} className={styles.nodeInfo} unmountOnExit>
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
      </CSSTransitionWithRef>
    </button>
  );
};

export { NodesButton };
