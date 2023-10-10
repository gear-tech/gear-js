import { buttonStyles } from '@gear-js/ui';
import clsx from 'clsx';
import { FunctionComponent, SVGProps } from 'react';

import ConnectSVG from 'shared/assets/images/actions/plus.svg?react';

import styles from './Wallet.module.scss';

type Props = {
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  name: string;
  isConnected: boolean;
  isActive: boolean;
  onClick: () => void;
};

const Wallet = ({ icon: Icon, name, isConnected, isActive, onClick }: Props) => {
  const buttonClassName = clsx(
    buttonStyles.button,
    buttonStyles.large,
    buttonStyles.block,
    styles.button,
    isConnected && styles.connected,
    isActive && styles.active,
  );

  return (
    <button type="button" className={buttonClassName} onClick={onClick}>
      <span>
        <Icon className={buttonStyles.icon} /> {name}
      </span>
      <span className={styles.text}>
        {isConnected ? 'Connected' : 'Not connected'}
        <ConnectSVG className={styles.connectIcon} />
      </span>
    </button>
  );
};

export { Wallet };
