import { Hex } from '@gear-js/api';
import { useApi, useAccount } from '@gear-js/react-hooks';
import { useState, useCallback, useEffect } from 'react';
import SimpleBar from 'simplebar-react';
import clsx from 'clsx';

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
  const [searchQuery, setSearchQuery] = useState('' as Hex);

  const list = searchQuery ? mailbox?.filter(([message]) => message.id === searchQuery) : mailbox;

  const isAnyMessage = list && list.length > 0;
  const isListEmpty = list?.length === 0;
  const isPlaceholderVisible = !isAnyMessage;

  const simpleBarClassName = clsx(styles.simpleBar, isPlaceholderVisible && styles.noOverflow);

  const handleClaim = useCallback(
    (messageId: Hex, reject: () => void) => {
      const removeMail = () =>
        setMailbox((prevState) => prevState && prevState.filter(([mail]) => mail.id !== messageId));

      claimMessage({ messageId, resolve: removeMail, reject });
    },
    [claimMessage],
  );

  const address = account?.address as Hex;

  useEffect(() => {
    setMailbox(undefined);
    setSearchQuery('' as Hex);

    if (address)
      api.mailbox
        .read(address)
        .then((result) => result.map((item) => item.toHuman() as FormattedMailboxItem))
        .then(setMailbox);
  }, [api, address]);

  return (
    <>
      <Header onSearchSubmit={setSearchQuery} />
      <SimpleBar className={simpleBarClassName}>
        {isAnyMessage ? <Messages list={list} onClaim={handleClaim} /> : <MessagesPlaceholder isEmpty={isListEmpty} />}
      </SimpleBar>
    </>
  );
};

export { Mailbox };
