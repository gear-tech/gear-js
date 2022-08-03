import { useState } from 'react';
import { Loader, Filter, MessageItem } from 'components';
import { useOwnFeed, useFeed } from 'hooks';
import { FILTERS_2 } from 'consts';

import styles from './Feeds.module.scss';

function Feeds() {
  const [filter, setFilter] = useState('All Channels');

  const feed = useFeed();
  const ownFeed = useOwnFeed();

  const getList = () => {
    switch (filter) {
      case 'My Feed':
        return ownFeed;
      default:
        return feed;
    }
  };

  const getMessages = () =>
    getList()?.map(({ timestamp, text, owner }) => (
      <MessageItem text={text} owner={owner} key={timestamp.replaceAll(',', '')} />
    ));

  const messages = getMessages();
  const isAnyMessages = !!messages?.length;

  return (
    <>
      <div className={styles.panel}>
        <Filter list={FILTERS_2} value={filter} onChange={setFilter} />
      </div>
      <div className={styles.feed}>
        {feed && ownFeed ? (
          <>
            {isAnyMessages && <ul className={styles.list}>{messages}</ul>}
            {!isAnyMessages && <p className={styles.text}>There are no any message at the moment.</p>}
          </>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}

export { Feeds };
