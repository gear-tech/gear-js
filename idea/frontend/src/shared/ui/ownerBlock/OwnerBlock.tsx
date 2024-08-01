import clsx from 'clsx';
import Identicon from '@polkadot/react-identicon';
import { Button } from '@gear-js/ui';
import { useAlert } from '@gear-js/react-hooks';

import { getShortName, copyToClipboard } from '../../helpers';
import CopySVG from '../../assets/images/actions/copyGreen.svg?react';
import styles from './OwnerBlock.module.scss';

type Props = {
  ownerAddress: string;
  color?: 'light' | 'primary';
  buttonText?: string;
};

const OwnerBlock = (props: Props) => {
  const { ownerAddress, color = 'primary', buttonText } = props;
  const alert = useAlert();
  const nameClassName = clsx(styles[color]);
  const buttonContent = buttonText ? { text: buttonText } : { icon: CopySVG };

  return (
    <div className={styles.ownerBlock}>
      <Identicon value={ownerAddress} size={16} theme="polkadot" />
      <span className={nameClassName}>{getShortName(ownerAddress)}</span>

      <Button
        {...buttonContent}
        className={styles.button}
        color="transparent"
        onClick={() => copyToClipboard(ownerAddress, alert)}
      />
    </div>
  );
};

export { OwnerBlock };
