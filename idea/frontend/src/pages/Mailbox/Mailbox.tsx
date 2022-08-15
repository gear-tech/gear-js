import { useCallback, useEffect, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Hex, MailboxItem } from '@gear-js/api';
import { useApi, useAccount } from '@gear-js/react-hooks';

import styles from './Mailbox.module.scss';
import { Message } from './children/Message';

import { useMessageClaim } from 'hooks';
import { ACCOUNT_ERRORS } from 'consts';
import { HumanMailboxItem } from 'types/api';
import { Box } from 'layout/Box/Box';
import { Spinner } from 'components/common/Spinner/Spinner';

const Mailbox = () => {
  const { api } = useApi();
  const { account } = useAccount();

  const claimMessage = useMessageClaim();

  const [mailbox, setMailbox] = useState<MailboxItem[] | null>(null);

  const handleClaim = useCallback(
    (messageId: Hex, reject: () => void) => {
      const removeMail = () =>
        setMailbox((prevState) => prevState && prevState.filter(([mail]) => !mail.id.eq(messageId)));

      claimMessage({ messageId, resolve: removeMail, reject });
    },
    [claimMessage]
  );

  const getMessages = (currentMailbox: MailboxItem[]) =>
    currentMailbox.map((mail) => (
      <CSSTransition key={mail[0].id.toHex()} timeout={300}>
        <Message message={mail.toHuman() as HumanMailboxItem} onClaim={handleClaim} />
      </CSSTransition>
    ));

  const address = account?.address as Hex;

  useEffect(() => {
    setMailbox(null);

    if (address) {
      api.mailbox.read(address).then(setMailbox);
    }
  }, [api, address]);

  if (!address) {
    return (
      <div className="wrapper">
        <Box className={styles.box}>
          <h2 className={styles.heading}>Mailbox:</h2>
          <div className={styles.messages}>
            <p className={styles.noMessages}>{ACCOUNT_ERRORS.WALLET_NOT_CONNECTED}</p>
          </div>
        </Box>
      </div>
    );
  }

  return (
    <div className="wrapper">
      {mailbox ? (
        <Box className={styles.box}>
          <h2 className={styles.heading}>Mailbox:</h2>
          <div className={styles.messages}>
            <TransitionGroup component={null}>{getMessages(mailbox)}</TransitionGroup>
            {!mailbox.length && <p className={styles.noMessages}>No messages</p>}
          </div>
        </Box>
      ) : (
        <Spinner absolute />
      )}
    </div>
  );
};

export { Mailbox };
