import { useState, useEffect } from 'react';
import { HexString } from '@polkadot/util/types';

import { useWaitlist } from 'hooks';
import { Subheader } from 'shared/ui/subheader';
import { SwitchButton } from 'shared/ui/switchButton';
import { IMessage } from 'entities/message';

import { MessageFilter } from '../model/consts';
import { Messages } from './messages';
import { Waitlist } from './waitlist';
import styles from './ProgramMessages.module.scss';

type Props = {
  programId: HexString;
  messages: IMessage[];
  isLoading: boolean;
};

const ProgramMessages = ({ programId, messages, isLoading }: Props) => {
  const messagesAmount = messages.length;

  const waitlistData = useWaitlist();
  const { waitlist, fetchWaitlist } = waitlistData;

  const [activeFilter, setActiveFilter] = useState(MessageFilter.Messages);

  const checkActive = (filter: MessageFilter) => filter === activeFilter;
  const switchActiveFilter = (filter: MessageFilter) => () => setActiveFilter(filter);

  const renderContent = () => {
    switch (activeFilter) {
      case MessageFilter.Messages:
        return <Messages messages={messages} isLoading={isLoading} totalCount={messagesAmount} />;

      case MessageFilter.Waitlist:
        return <Waitlist waitlist={waitlist} isLoading={waitlistData.isLoading} totalCount={waitlistData.totalCount} />;

      default:
        return null;
    }
  };

  useEffect(() => {
    fetchWaitlist(programId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.programMessages}>
      <Subheader title="Messages">
        <div className={styles.filters}>
          <SwitchButton
            text={`Messages: ${messagesAmount}`}
            isActive={checkActive(MessageFilter.Messages)}
            className={styles.messagesBtn}
            onClick={switchActiveFilter(MessageFilter.Messages)}
          />
          <SwitchButton
            text={`Waitlist: ${waitlistData.totalCount}`}
            isActive={checkActive(MessageFilter.Waitlist)}
            onClick={switchActiveFilter(MessageFilter.Waitlist)}
          />
        </div>
      </Subheader>
      {renderContent()}
    </div>
  );
};

export { ProgramMessages };
