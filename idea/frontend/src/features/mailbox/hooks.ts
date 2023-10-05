import { useAccount, useApi } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { useEffect, useState } from 'react';

import { MailboxItem } from './types';

function useMailbox() {
  const { api, isApiReady } = useApi();

  const { account } = useAccount();
  const { decodedAddress } = account || {};

  const [mailbox, setMailbox] = useState<MailboxItem[]>();

  useEffect(() => {
    setMailbox(undefined);

    if (!isApiReady || !decodedAddress) return;

    api.mailbox
      .read(decodedAddress)
      .then((items) => items.map((item) => item.toHuman() as MailboxItem))
      .then((result) => setMailbox(result));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, decodedAddress]);

  // hide message on value claim e.g.
  const removeMessage = (id: HexString) =>
    setMailbox((prevMailbox) => prevMailbox?.filter(([message]) => message.id !== id));

  return { mailbox, removeMessage };
}

function useMailboxItem(messageId: HexString | undefined) {
  const { api, isApiReady } = useApi();

  const { account } = useAccount();
  const { decodedAddress } = account || {};

  const [mailboxItem, setMailboxItem] = useState<MailboxItem>();

  useEffect(() => {
    setMailboxItem(undefined);

    if (!isApiReady || !decodedAddress || !messageId) return;

    // TODO: error should be thrown in @gear-js/api
    api.mailbox
      .read(decodedAddress, messageId)
      .then((item) =>
        Array.isArray(item) ? (item.toHuman() as MailboxItem) : Promise.reject(new Error('Message not found')),
      )
      .then((result) => setMailboxItem(result));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady, decodedAddress, messageId]);

  return mailboxItem;
}

export { useMailbox, useMailboxItem };
