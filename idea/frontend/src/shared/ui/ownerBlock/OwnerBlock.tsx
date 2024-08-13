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
  maxLength?: boolean;
};

const OwnerBlock = ({ ownerAddress, color = 'primary', buttonText, maxLength = true }: Props) => {
  const alert = useAlert();

  const buttonContent = buttonText ? { text: buttonText } : { icon: CopySVG };
  const varaAddress = getVaraAddress(ownerAddress);

  return (
    <div className={styles.ownerBlock}>
      <Identicon value={ownerAddress} size={16} theme="polkadot" />
      <span className={styles[color]}>{maxLength ? getShortName(varaAddress) : varaAddress}</span>

      <Button
        {...buttonContent}
        className={styles.button}
        color="transparent"
        onClick={() => copyToClipboard(varaAddress, alert)}
      />
    </div>
  );
};

export { OwnerBlock };
