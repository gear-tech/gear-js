import { HexString } from '@polkadot/util/types';
import { isHex } from '@polkadot/util';
import { useState } from 'react';
import SimpleBar from 'simplebar-react';

import { useMailbox } from '@/features/mailbox';
import { useMessageClaim } from '@/hooks';
import { SearchForm } from '@/shared/ui';

import { Messages } from './messages';
import { MessagesPlaceholder } from './messagesPlaceholder';
import styles from './Mailbox.module.scss';

const Mailbox = () => {
  const claimMessage = useMessageClaim();
  const { mailbox, removeMessage } = useMailbox();

  const [searchQuery, setSearchQuery] = useState('');

  const list = searchQuery ? mailbox?.filter(([message]) => message.id === searchQuery) : mailbox;
  const isAnyMessage = list && list.length > 0;
  const isListEmpty = list?.length === 0;

  const handleClaimButtonClick = (messageId: HexString, reject: () => void) => {
    claimMessage({ messageId, resolve: () => removeMessage(messageId), reject });
  };

  return (
    <>
      <header className={styles.header}>
        <h2 className={styles.heading}>Mailbox</h2>

        <SearchForm
          placeholder="Search by id..."
          getSchema={(schema) => schema.refine((value) => isHex(value), 'Value should be hex')}
          onSubmit={setSearchQuery}
          className={styles.form}
        />
      </header>

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
