import { Hex } from '@gear-js/api';
import { CSSTransition } from 'react-transition-group';

import { FormattedMailboxItem } from '../../model';
import { Message } from '../message';

type Props = {
  list: FormattedMailboxItem[];
  onClaim: (messageId: Hex, reject: () => void) => void;
};

const Messages = ({ list, onClaim }: Props) => {
  const getMessages = () =>
    list.map((mail) => (
      <CSSTransition key={mail[0].id} timeout={300}>
        <Message value={mail} onClaim={onClaim} />
      </CSSTransition>
    ));

  return <ul>{getMessages()}</ul>;
};

export { Messages };
