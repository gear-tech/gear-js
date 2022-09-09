import { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Hex } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';

import { PaginationModel } from 'api/types';
import { useMessages, useWaitlist, useChangeEffect, useDataLoading } from 'hooks';
import { AnimationTimeout } from 'shared/config';
import { Subheader } from 'shared/ui/subheader';
import { SwitchButton } from 'shared/ui/switchButton';

import styles from './ProgramMessages.module.scss';
import { MessageFilter } from '../model/consts';
import { Messages } from './messages';
import { Waitlist } from './waitlist';

type Props = {
  programId: Hex;
};

const ProgramMessages = ({ programId }: Props) => {
  const { account } = useAccount();

  const messagesData = useMessages();
  const waitlistData = useWaitlist();

  const isLoggedIn = Boolean(account);
  const destination = account?.decodedAddress;

  const [activeFilter, setActiveFilter] = useState(isLoggedIn ? MessageFilter.Messages : MessageFilter.Waitlist);

  const { messages, fetchMessages } = messagesData;
  const { waitlist, fetchWaitlist } = waitlistData;

  const { loadData: loadMessages, changeParams } = useDataLoading<PaginationModel>({
    initLoad: isLoggedIn,
    fetchData: fetchMessages,
    defaultParams: {
      source: programId,
      destination,
    },
  });

  const checkActive = (filter: MessageFilter) => filter === activeFilter;

  const switchActiveFilter = (filter: MessageFilter) => () => setActiveFilter(filter);

  const renderContent = () => {
    switch (activeFilter) {
      case MessageFilter.Messages:
        return (
          <Messages
            messages={messages}
            isLoading={messagesData.isLoading}
            totalCount={messagesData.totalCount}
            loadMoreMessages={loadMessages}
          />
        );
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

  useChangeEffect(() => {
    if (destination) {
      changeParams({
        source: programId,
        destination,
      });
    } else {
      setActiveFilter(MessageFilter.Waitlist);
    }
  }, [destination]);

  return (
    <div className={styles.programMessages}>
      <Subheader title="Messages">
        <div className={styles.filters}>
          <CSSTransition in={isLoggedIn} exit={false} timeout={AnimationTimeout.Default} mountOnEnter unmountOnExit>
            <SwitchButton
              text={`Messages: ${messagesData.totalCount}`}
              isActive={checkActive(MessageFilter.Messages)}
              className={styles.messagesBtn}
              onClick={switchActiveFilter(MessageFilter.Messages)}
            />
          </CSSTransition>
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
