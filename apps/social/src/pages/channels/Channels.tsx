import { useState } from 'react';
import { useChannels } from 'hooks';
import { Loader, Filter } from 'components';
import { FILTERS } from 'consts';
import { useAccount } from '@gear-js/react-hooks';
import { Item } from './item';
import styles from './Channels.module.scss';

function Channels() {
  const [filter, setFilter] = useState(FILTERS[0]);
  const { account } = useAccount();

  const { channels } = useChannels();

  const getList = () => {
    switch (filter) {
      case 'My':
        return channels?.filter((ch) => ch.ownerId === account?.decodedAddress);
      default:
        return channels;
    }
  };

  const getChannels = () => getList()?.map(({ id, name, ownerId }) => <Item key={id} id={id} name={name} ownerId={ownerId} />);

  const channel = getChannels();
  const isAnyChannel = !!channel?.length;

  return (
    <>
      <header className={styles.header}>
        <h2 className={styles.heading}>Channel List</h2>
        {account && <Filter list={FILTERS} value={filter} onChange={setFilter} />}
      </header>
      {channels ? (
        <>
          {isAnyChannel && <div className={styles.list}>{channel}</div>}
          {!isAnyChannel && <p className={styles.text}>There are no any Channel at the moment.</p>}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export { Channels };
