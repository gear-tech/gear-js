import { HexString } from '@gear-js/api';
import clsx from 'clsx';
import SimpleBar from 'simplebar-react';

import { useDataLoading, useScrollLoader } from '@/hooks';

import { Placeholder } from '@/entities/placeholder';
import HorizontalMessageCardSVG from '@/shared/assets/images/placeholders/horizontalMessageCard.svg?react';
import { FilterGroup, Filters, Radio } from '@/features/filters';
import { List, SearchForm } from '@/shared/ui';

import { useMessagesToProgram, useMessagesFromProgram } from '../../hooks';
import { MessageCard } from '../message-card';
import styles from './program-messages.module.scss';
import { useState } from 'react';
import { isHex } from '@/shared/helpers';
import { MessageFromProgram, MessageToProgram } from '../../api';

type Props = {
  programId: HexString;
};

const FILTER_NAME = 'direction' as const;

const FILTER_VALUE = {
  TO: 'to',
  FROM: 'from',
} as const;

const DEFAULT_FILTER_VALUES = {
  [FILTER_NAME]: FILTER_VALUE.TO as typeof FILTER_VALUE[keyof typeof FILTER_VALUE],
};

const ProgramMessages = ({ programId }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState(DEFAULT_FILTER_VALUES);
  const isToProgram = filters[FILTER_NAME] === FILTER_VALUE.TO;

  const toMessages = useMessagesToProgram({ destination: programId }, isToProgram);
  const fromMessages = useMessagesFromProgram({ source: programId }, !isToProgram);
  const messages = isToProgram ? toMessages : fromMessages;

  // const hasMore = false;
  // const isEmpty = true;
  // const isLoaderShowing = false;

  // const sortedMessages = [];

  // const renderMessages = () => sortedMessages.map((message) => <MessageCard key={message.id} message={message} />);

  return (
    <div className={styles.messages}>
      <div>
        {/* <h3 className={styles.heading}>Messages: {totalCount}</h3> */}

        <List
          items={messages.data?.result || []}
          hasMore={messages.hasNextPage}
          renderItem={(message) => <MessageCard message={message} />}
          fetchMore={messages.fetchNextPage}
        />

        {/* <SimpleBar
          className={clsx(styles.simpleBar, isLoaderShowing && styles.noOverflow)}
          scrollableNodeProps={{ ref: scrollableNodeRef }}>
          {isLoaderShowing ? (
            <Placeholder
              block={<HorizontalMessageCardSVG className={styles.placeholderBlock} />}
              title="There are no messages yet"
              isEmpty={isEmpty}
              blocksCount={8}
            />
          ) : (
            renderMessages()
          )}
        </SimpleBar> */}
      </div>

      <div>
        <SearchForm
          onSubmit={setSearchQuery}
          getSchema={(schema) => schema.refine((value) => isHex(value), 'Value should be hex')}
          placeholder="Search by id, source, destination..."
          className={styles.search}
        />

        <Filters initialValues={DEFAULT_FILTER_VALUES} onSubmit={setFilters}>
          <FilterGroup name={FILTER_NAME} onSubmit={setFilters}>
            <Radio name={FILTER_NAME} value={FILTER_VALUE.TO} label="To Program" onSubmit={setFilters} />
            <Radio name={FILTER_NAME} value={FILTER_VALUE.FROM} label="From Program" onSubmit={setFilters} />
          </FilterGroup>
        </Filters>
      </div>
    </div>
  );
};

export { ProgramMessages };
