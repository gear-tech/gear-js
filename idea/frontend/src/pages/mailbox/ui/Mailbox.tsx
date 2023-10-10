import { useAccount } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { useState, useEffect } from 'react';
import SimpleBar from 'simplebar-react';

import { useMailbox } from '@/features/mailbox';
import { useMessageClaim } from '@/hooks';

import { Messages } from './messages';
import { Header } from './header';
import { MessagesPlaceholder } from './messagesPlaceholder';
import styles from './Mailbox.module.scss';

const Mailbox = () => {
  const { account } = useAccount();
  const { address } = account || {};

  const claimMessage = useMessageClaim();
  const { mailbox, removeMessage } = useMailbox();

  const [searchQuery, setSearchQuery] = useState('' as HexString);

  const list = searchQuery ? mailbox?.filter(([message]) => message.id === searchQuery) : mailbox;
  const isAnyMessage = list && list.length > 0;
  const isListEmpty = list?.length === 0;

  const handleClaimButtonClick = (messageId: HexString, reject: () => void) => {
    claimMessage({ messageId, resolve: () => removeMessage(messageId), reject });
  };

  useEffect(() => {
    setSearchQuery('' as HexString);
  }, [address]);

  return (
    <>
      <Header onSearchSubmit={setSearchQuery} />

      {isAnyMessage ? (
        <SimpleBar className={styles.simpleBar}>
          <Messages list={list} onClaim={handleClaimButtonClick} />
        </SimpleBar>
      ) : (
        <MessagesPlaceholder isEmpty={isListEmpty} />
      )}
    </>
  );
};

export { Mailbox };
