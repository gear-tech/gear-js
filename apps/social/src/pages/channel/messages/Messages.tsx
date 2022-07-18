import { useMessages } from 'hooks';
import { Loader } from 'components';
import Identicon from '@polkadot/react-identicon';
import { toShortAddress } from 'utils';

import styles from './Messages.module.scss';

type Props = {
  ownerId: string;
};

function Messages({ ownerId }: Props) {
  const { messages } = useMessages();

  const message = messages?.map(({ text, timestamp }) => (
    <div className={styles.message} key={timestamp.replaceAll(',', '')}>
      <div className={styles.info}>
        <div className={styles.icon}>
          <Identicon value={ownerId} size={25} theme="polkadot" />
        </div>
        <div className={styles.name}>{toShortAddress(ownerId!)}</div>
      </div>
      <div className={styles.text}>{text}</div>
    </div>
  ));

  return <div className={styles.container}>{messages ? message?.reverse() : <Loader />}</div>;
}

export { Messages };
