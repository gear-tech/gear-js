import { HexString } from '@gear-js/api';
import { useMemo, useState } from 'react';
import { Sails } from 'sails-js';

import MessageCardPlaceholderSVG from '@/shared/assets/images/placeholders/horizontalMessageCard.svg?react';
import { FilterGroup, Filters, Radio } from '@/features/filters';
import { List, ProgramTabLayout, SearchForm, Skeleton } from '@/shared/ui';
import { isHex } from '@/shared/helpers';

import { useMessagesToProgram, useMessagesFromProgram } from '../../api';
import { MessageCard } from '../message-card';

type Props = {
  programId: HexString;
  sails: Sails | undefined;
};

const FILTER_NAME = {
  DIRECTION: 'direction',
  METHOD: 'method',
} as const;

const FILTER_VALUE = {
  TO: 'to',
  FROM: 'from',
} as const;

const DEFAULT_FILTER_VALUES = {
  [FILTER_NAME.DIRECTION]: FILTER_VALUE.TO as typeof FILTER_VALUE[keyof typeof FILTER_VALUE],
  [FILTER_NAME.METHOD]: '',
};

const ProgramMessages = ({ programId, sails }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTER_VALUES);

  const isToDirection = filters[FILTER_NAME.DIRECTION] === FILTER_VALUE.TO;

  const filterParams = useMemo(() => {
    const [service, fn] = filters[FILTER_NAME.METHOD].split('.');

    return { service, fn };
  }, [filters]);

  const methods = useMemo(() => {
    if (!sails) return;

    return Object.entries(sails.services).flatMap(([name, service]) =>
      Object.keys(service.functions).map((fnName) => `${name}.${fnName}`),
    );
  }, [sails]);

  const toMessages = useMessagesToProgram(
    { destination: programId, source: searchQuery, ...filterParams },
    isToDirection,
  );

  const fromMessages = useMessagesFromProgram(
    { source: programId, destination: searchQuery, ...filterParams },
    !isToDirection,
  );

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
      <FilterGroup title="Direction" name={FILTER_NAME.DIRECTION} onSubmit={setFilters}>
        <Radio name={FILTER_NAME.DIRECTION} value={FILTER_VALUE.TO} label="To Program" onSubmit={setFilters} />
        <Radio name={FILTER_NAME.DIRECTION} value={FILTER_VALUE.FROM} label="From Program" onSubmit={setFilters} />
      </FilterGroup>

      {methods?.length ? (
        <FilterGroup title="Function" name={FILTER_NAME.METHOD} onSubmit={setFilters}>
          <Radio label="None" name={FILTER_NAME.METHOD} value="" onSubmit={setFilters} />

          {methods.map((method) => (
            <Radio key={method} name={FILTER_NAME.METHOD} value={method} label={method} onSubmit={setFilters} />
          ))}
        </FilterGroup>
      ) : null}
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
