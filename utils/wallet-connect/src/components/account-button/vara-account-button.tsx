import * as Vara from '@gear-js/vara-ui';
import { Identicon } from '@polkadot/react-identicon';

import styles from './account-button.module.scss';

type Props = {
  name: string | undefined;
  address: string;
} & Pick<Vara.ButtonProps, 'block' | 'color' | 'size' | 'onClick'>;

function VaraAccountButton({ address, name, color = 'contrast', size, block, onClick }: Props) {
  return (
    <Vara.Button type="button" size={size} color={color} onClick={onClick} block={block}>
      <Identicon value={address} size={16} theme="polkadot" className={styles.icon} />
      <span>{name}</span>
    </Vara.Button>
  );
}

type ModalProps = Omit<Props, 'size' | 'block' | 'color'> & {
  color: 'primary' | 'plain';
};

function VaraAccountButtonModal(props: ModalProps) {
  return <VaraAccountButton size="small" block {...props} />;
}

VaraAccountButton.Modal = VaraAccountButtonModal;

export { VaraAccountButton };
