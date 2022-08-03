import Identicon from '@polkadot/react-identicon';
import { toShortAddress } from 'utils';

import styles from './MessageItem.module.scss';

type Props = {
  text: string;
  owner: string;
};

function MessageItem({ text, owner }: Props) {
  return (
    <div className={styles.message}>
      <div className={styles.info}>
        <div className={styles.icon}>
          <Identicon value={owner} size={25} theme="polkadot" />
        </div>
        <div className={styles.name}>{toShortAddress(owner)}</div>
      </div>
      <div className={styles.text}>{text}</div>
    </div>
  );
}

export { MessageItem };
