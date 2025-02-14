import { HexString } from '@polkadot/util/types';

import { MailboxItem } from '@/features/mailbox';

import { Message } from '../message';

type Props = {
  list: MailboxItem[];
  onClaim: (messageId: HexString, reject: () => void) => void;
};

const Messages = ({ list, onClaim }: Props) => {
  const getMessages = () => list.map((mail) => <Message key={mail[0].id} value={mail} onClaim={onClaim} />);

  return <ul>{getMessages()}</ul>;
};

export { Messages };
