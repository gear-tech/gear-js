import { TABLE_COLS, TABLE_HEADER } from './const';
import { getRowKey } from './helpers';
import { MessageItem } from './children/MessageItem';

import { MessageModel } from 'types/message';
import { Table } from 'components/common/Table';

type Props = {
  messages?: MessageModel[];
  isLoading?: boolean;
  className?: string;
};

const MessagesList = ({ messages, isLoading = false, className }: Props) => {
  const renderRow = (message: MessageModel) => <MessageItem message={message} />;

  return (
    <Table
      rows={messages}
      cols={TABLE_COLS}
      header={TABLE_HEADER}
      message="No messages"
      isLoading={isLoading}
      bodyClassName={className}
      getRowKey={getRowKey}
      renderRow={renderRow}
    />
  );
};

export { MessagesList };
