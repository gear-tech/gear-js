import { useCallback, useEffect, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Hex, MailboxType } from '@gear-js/api';
import { useApi, useAccount } from '@gear-js/react-hooks';

import styles from './Mailbox.module.scss';
import { Message } from './children/Message';

import { useClaimMessage } from 'hooks';
import { Box } from 'layout/Box/Box';
import { Spinner } from 'components/common/Spinner/Spinner';

const Mailbox = () => {
  const { api } = useApi();
  const { account } = useAccount();

  const [mailbox, setMailbox] = useState<MailboxType | null>(null);

  const claimMessage = useClaimMessage();

  const handleClaim = useCallback(
    (messageId: Hex) => {
      const removeMail = () =>
        setMailbox((prevState) => prevState && prevState.filter(([, message]) => message.id !== messageId));

      return claimMessage(messageId, removeMail);
    },
    [claimMessage]
  );

  const address = account?.address;

  useEffect(() => {
    if (address) {
      api.mailbox.read(address).then(setMailbox);
    } else {
      setMailbox(null);
    }
  }, [api, address]);

  return (
    <div className="wrapper">
      {mailbox ? (
        <Box className={styles.box}>
          <h2 className={styles.heading}>Mailbox:</h2>
          <div className={styles.messages}>
            <TransitionGroup component={null}>
              {mailbox.map(([, message]) => (
                <CSSTransition key={message.id} timeout={300}>
                  <Message message={message} onClaim={handleClaim} />
                </CSSTransition>
              ))}
            </TransitionGroup>
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
