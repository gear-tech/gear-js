import * as Gear from '@gear-js/ui';
import { Identicon } from '@polkadot/react-identicon';
import cx from 'clsx';

import styles from './account-button.module.scss';

type Props = {
  name: string | undefined;
  address: string;
} & Pick<Gear.ButtonProps, 'block' | 'color' | 'size' | 'onClick'>;

function GearAccountButton(props: Props) {
  const { address, name, size = 'medium', color = 'light', block, onClick } = props;

  return (
    <button
      type="button"
      className={cx(
        Gear.buttonStyles.button,
        Gear.buttonStyles.noWrap,
        Gear.buttonStyles[size],
        Gear.buttonStyles[color],
        block && Gear.buttonStyles.block,
        styles.button,
      )}
      onClick={onClick}>
      <Identicon value={address} size={16} theme="polkadot" className={cx(Gear.buttonStyles.icon, styles.icon)} />
      <span>{name}</span>
    </button>
  );
}

type ModalProps = Omit<Props, 'size' | 'block' | 'color'> & {
  color: 'primary' | 'plain';
};

function GearAccountButtonModal({ color, ...props }: ModalProps) {
  return <GearAccountButton size="large" color={color === 'plain' ? 'light' : 'primary'} block {...props} />;
}

GearAccountButton.Modal = GearAccountButtonModal;

export { GearAccountButton };
