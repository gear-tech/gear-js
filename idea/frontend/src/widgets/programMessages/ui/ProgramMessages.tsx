import { useState, useEffect } from 'react';
import { HexString } from '@polkadot/util/types';

import { useDataLoading, useMessages, useWaitlist } from 'hooks';
import { Subheader } from 'shared/ui/subheader';
import { SwitchButton } from 'shared/ui/switchButton';

import { MessageFilter } from '../model/consts';
import { Messages } from './messages';
import { Waitlist } from './waitlist';
import styles from './ProgramMessages.module.scss';

type Props = {
  programId: HexString;
};

type RequestParams = {
  source: HexString;
};

const ProgramMessages = ({ programId }: Props) => {
  const { messages, totalCount, isLoading: isMessagesLoading, fetchMessages } = useMessages();
  const { waitlist, isLoading: isWaitlistLoading, fetchWaitlist } = useWaitlist();
  const [activeFilter, setActiveFilter] = useState(MessageFilter.Messages);

  const { loadData } = useDataLoading<RequestParams>({
    defaultParams: { source: programId },
    fetchData: fetchMessages,
  });

  const sortedMessages = messages.sort((msg, nextMsg) => Date.parse(nextMsg.timestamp) - Date.parse(msg.timestamp));

  useEffect(() => {
    fetchWaitlist(programId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.programMessages}>
      <Subheader title="Messages">
        <div className={styles.filters}>
          <SwitchButton
            text={`Messages: ${totalCount}`}
            isActive={activeFilter === MessageFilter.Messages}
            onClick={() => setActiveFilter(MessageFilter.Messages)}
          />

          <SwitchButton
            text={`Waitlist: ${waitlist.length}`}
            isActive={activeFilter === MessageFilter.Waitlist}
            onClick={() => setActiveFilter(MessageFilter.Waitlist)}
          />
        </div>
      </Subheader>

      {activeFilter === MessageFilter.Messages && (
        <Messages messages={sortedMessages} isLoading={isMessagesLoading} totalCount={totalCount} loadMore={loadData} />
      )}

      {activeFilter === MessageFilter.Waitlist && (
        <Waitlist waitlist={waitlist} isLoading={isWaitlistLoading} totalCount={waitlist.length} />
      )}
    </div>
  );
};

export { ProgramMessages };
