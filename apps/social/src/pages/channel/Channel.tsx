import { useChannel } from 'hooks';
import { Loader, OnLogin } from 'components';
import { toShortAddress } from 'utils';
import { useAccount } from '@gear-js/react-hooks';
import { SubscribeAction, MessageAction } from './actions';
import { Messages } from './messages';

import styles from './Channel.module.scss';

function Channel() {
  const { account } = useAccount();
  const channel = useChannel();

  const { name, description, ownerId } = channel || {};
  const isOwner = account?.decodedAddress === ownerId;

  return (
    <div>
      {channel ? (
        <>
          <header className={styles.header}>
            <h2 className={styles.heading}>{name}</h2>
            <h3 className={styles.owner}>by {toShortAddress(ownerId!)}</h3>
            <div className={styles.description}>{description}</div>
          </header>

          <div className={styles.buttons}>
            {isOwner ? <MessageAction /> : <SubscribeAction />}
          </div>
          <Messages />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export { Channel };
