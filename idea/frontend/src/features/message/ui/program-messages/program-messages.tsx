import { HexString } from '@gear-js/api';
import { useState } from 'react';

import MessageCardPlaceholderSVG from '@/shared/assets/images/placeholders/horizontalMessageCard.svg?react';
import { FilterGroup, Filters, Radio } from '@/features/filters';
import { List, ProgramTabLayout, SearchForm, Skeleton } from '@/shared/ui';
import { isHex } from '@/shared/helpers';

import { useMessagesToProgram, useMessagesFromProgram } from '../../api';
import { MessageCard } from '../message-card';

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
  const isToDirection = filters[FILTER_NAME] === FILTER_VALUE.TO;

  const toMessages = useMessagesToProgram({ destination: programId, source: searchQuery }, isToDirection);
  const fromMessages = useMessagesFromProgram({ source: programId, destination: searchQuery }, !isToDirection);
  const messages = isToDirection ? toMessages : fromMessages;

  const renderList = () => (
    <List
      items={messages.data?.result}
      hasMore={messages.hasNextPage}
      isLoading={messages.isLoading}
      noItems={{ heading: 'There are no messages yet.' }}
      size="small"
      renderItem={(message) => <MessageCard isToDirection={isToDirection} message={message} />}
      renderSkeleton={() => <Skeleton SVG={MessageCardPlaceholderSVG} disabled />}
      fetchMore={messages.fetchNextPage}
    />
  );

  const renderSearch = () => (
    <SearchForm
      getSchema={(schema) => schema.refine((value) => isHex(value), 'Value should be hex')}
      onSubmit={setSearchQuery}
      placeholder={isToDirection ? 'Search by source...' : 'Search by destination...'}
    />
  );

  const renderFilters = () => (
    <Filters initialValues={DEFAULT_FILTER_VALUES} onSubmit={setFilters}>
      <FilterGroup name={FILTER_NAME} onSubmit={setFilters}>
        <Radio name={FILTER_NAME} value={FILTER_VALUE.TO} label="To Program" onSubmit={setFilters} />
        <Radio name={FILTER_NAME} value={FILTER_VALUE.FROM} label="From Program" onSubmit={setFilters} />
      </FilterGroup>
    </Filters>
  );

  return (
    <ProgramTabLayout
      heading="Messages"
      count={messages.data?.count}
      renderList={renderList}
      renderSearch={renderSearch}
      renderFilters={renderFilters}
    />
  );
};

export { ProgramMessages };
