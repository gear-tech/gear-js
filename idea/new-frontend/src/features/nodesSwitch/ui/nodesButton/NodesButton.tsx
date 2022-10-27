import { MouseEvent } from 'react';
import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui';

import connectSVG from 'shared/assets/images/menu/connect.svg';

import styles from './NodesButton.module.scss';

type Props = {
  name: string;
  chain: string;
  version: string;
  isApiReady: boolean;
  isOpen: boolean;
  onClick: (event: MouseEvent) => void;
};

const NodesButton = ({ name, chain, version, isApiReady, isOpen, onClick }: Props) => {
  const btnClasses = clsx(buttonStyles.button, buttonStyles.light, styles.nodeInfoButton, isOpen && styles.open);

  return (
    <button type="button" className={btnClasses} onClick={onClick}>
      <p className={styles.menuIconWrapper}>
        <img src={connectSVG} alt="connect" className={buttonStyles.icon} />
      </p>
      <p className={styles.nodeInfo}>
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
    </button>
  );
};

export { NodesButton };
