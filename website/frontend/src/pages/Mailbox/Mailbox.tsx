import { useEffect, useState } from 'react';
import { MailboxType } from '@gear-js/api';

import styles from './Mailbox.module.scss';
import { Message } from './children/Message/Message';

import { useApi, useAccount, useClaimMessage } from 'hooks';
import { Box } from 'layout/Box/Box';
import { Spinner } from 'components/common/Spinner/Spinner';

const Mailbox = () => {
  const { api } = useApi();
  const { account } = useAccount();

  const [mailbox, setMailbox] = useState<MailboxType | null>(null);

  const handleClaim = useClaimMessage();

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
            {mailbox.map(([, message]) => (
              <Message key={message.id} message={message} onClaim={handleClaim} />
            ))}

            {!mailbox.length && <p>No messages</p>}
          </div>
        </Box>
      ) : (
        <Spinner absolute />
      )}
    </div>
  );
};

export { Mailbox };
