import { useApi, useAccount } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { useState, useCallback, useEffect } from 'react';
import SimpleBar from 'simplebar-react';

import { useMessageClaim } from 'hooks';

import { FormattedMailboxItem } from '../model';
import { Messages } from './messages';
import { Header } from './header';
import { MessagesPlaceholder } from './messagesPlaceholder';
import styles from './Mailbox.module.scss';

const Mailbox = () => {
  const { api } = useApi();
  const { account } = useAccount();

  const claimMessage = useMessageClaim();

  const [mailbox, setMailbox] = useState<FormattedMailboxItem[]>();
  const [searchQuery, setSearchQuery] = useState('' as HexString);

  const list = searchQuery ? mailbox?.filter(([message]) => message.id === searchQuery) : mailbox;

  const isAnyMessage = list && list.length > 0;
  const isListEmpty = list?.length === 0;

  const handleClaim = useCallback(
    (messageId: HexString, reject: () => void) => {
      const removeMail = () =>
        setMailbox((prevState) => prevState && prevState.filter(([mail]) => mail.id !== messageId));

      claimMessage({ messageId, resolve: removeMail, reject });
    },
    [claimMessage],
  );

  const address = account?.address as HexString;

  useEffect(() => {
    setMailbox(undefined);
    setSearchQuery('' as HexString);

    if (address)
      api.mailbox
        .read(address)
        .then((result) => result.map((item) => item.toHuman() as FormattedMailboxItem))
        .then(setMailbox);
  }, [api, address]);

  return (
    <>
      <Header onSearchSubmit={setSearchQuery} />

      {isAnyMessage ? (
        <SimpleBar className={styles.simpleBar}>
          <Messages list={list} onClaim={handleClaim} />
        </SimpleBar>
      ) : (
        <MessagesPlaceholder isEmpty={isListEmpty} />
      )}
    </>
  );
};

export { Mailbox };
