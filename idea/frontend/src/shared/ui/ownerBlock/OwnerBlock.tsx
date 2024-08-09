import Identicon from '@polkadot/react-identicon';
import { Button } from '@gear-js/ui';
import { getVaraAddress, useAlert } from '@gear-js/react-hooks';

import { getShortName, copyToClipboard } from '../../helpers';
import CopySVG from '../../assets/images/actions/copyGreen.svg?react';
import styles from './OwnerBlock.module.scss';

type Props = {
  ownerAddress: string;
  color?: 'light' | 'primary';
  buttonText?: string;
};

const OwnerBlock = ({ ownerAddress, color = 'primary', buttonText }: Props) => {
  const alert = useAlert();
  const buttonContent = buttonText ? { text: buttonText } : { icon: CopySVG };

  return (
    <div className={styles.ownerBlock}>
      <Identicon value={ownerAddress} size={16} theme="polkadot" />
      <span className={styles[color]}>{getShortName(getVaraAddress(ownerAddress))}</span>

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
