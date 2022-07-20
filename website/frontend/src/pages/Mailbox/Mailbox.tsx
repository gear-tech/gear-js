import { useCallback, useEffect, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Hex, MailboxItem } from '@gear-js/api';
import { useApi, useAccount } from '@gear-js/react-hooks';

import styles from './Mailbox.module.scss';
import { Message, HumanMailboxItem } from './children/Message';

import { useClaimMessage } from 'hooks';
import { Box } from 'layout/Box/Box';
import { Spinner } from 'components/common/Spinner/Spinner';

const Mailbox = () => {
  const { api } = useApi();
  const { account } = useAccount();

  const [mailbox, setMailbox] = useState<MailboxItem[] | null>(null);

  const claimMessage = useClaimMessage();

  const handleClaim = useCallback(
    (messageId: Hex) => {
      const removeMail = () =>
        setMailbox((prevState) => prevState && prevState.filter(([mail]) => !mail.id.eq(messageId)));

      return claimMessage(messageId, removeMail);
    },
    [claimMessage]
  );

  const address = account?.address as Hex;

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
              {mailbox.map((mail) => (
                <CSSTransition key={mail[0].id.toHex()} timeout={300}>
                  <Message message={mail.toHuman() as HumanMailboxItem} onClaim={handleClaim} />
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
