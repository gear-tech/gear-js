import { HexString } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { useMemo, useState } from 'react';
import { Sails } from 'sails-js';

import MessageCardPlaceholderSVG from '@/shared/assets/images/placeholders/horizontalMessageCard.svg?react';
import { FilterGroup, Filters, Radio } from '@/features/filters';
import { List, ProgramTabLayout, Skeleton } from '@/shared/ui';

import { useMessagesToProgram, useMessagesFromProgram } from '../../api';
import { MessageCard } from '../message-card';

type Props = {
  programId: HexString;
  sails: Sails | undefined;
};

const FILTER_NAME = {
  OWNER: 'owner',
  DIRECTION: 'direction',
  METHOD: 'method',
} as const;

const FILTER_VALUE = {
  OWNER: {
    ALL: 'all',
    OWNER: 'owner',
  },

  DIRECTION: {
    TO: 'to',
    FROM: 'from',
  },
} as const;

const DEFAULT_FILTER_VALUES = {
  [FILTER_NAME.OWNER]: FILTER_VALUE.OWNER.ALL as typeof FILTER_VALUE.OWNER[keyof typeof FILTER_VALUE.OWNER],
  [FILTER_NAME.DIRECTION]: FILTER_VALUE.DIRECTION
    .TO as typeof FILTER_VALUE.DIRECTION[keyof typeof FILTER_VALUE.DIRECTION],
  [FILTER_NAME.METHOD]: '',
};

const ProgramMessages = ({ programId, sails }: Props) => {
  const { account } = useAccount();

  const [filters, setFilters] = useState(DEFAULT_FILTER_VALUES);

  const isToDirection = filters[FILTER_NAME.DIRECTION] === FILTER_VALUE.DIRECTION.TO;
  const addressParam = filters[FILTER_NAME.OWNER] === FILTER_VALUE.OWNER.OWNER ? account?.decodedAddress : undefined;

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
    { destination: programId, source: addressParam, ...filterParams },
    isToDirection,
  );

  const fromMessages = useMessagesFromProgram(
    { source: programId, destination: addressParam, ...filterParams },
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

  const renderFilters = () => (
    <Filters initialValues={DEFAULT_FILTER_VALUES} onSubmit={setFilters}>
      {account && (
        <FilterGroup name={FILTER_NAME.OWNER} onSubmit={setFilters}>
          <Radio name={FILTER_NAME.OWNER} value={FILTER_VALUE.OWNER.ALL} label="All messages" onSubmit={setFilters} />
          <Radio name={FILTER_NAME.OWNER} value={FILTER_VALUE.OWNER.OWNER} label="My messages" onSubmit={setFilters} />
        </FilterGroup>
      )}

      <FilterGroup title="Direction" name={FILTER_NAME.DIRECTION} onSubmit={setFilters}>
        <Radio
          name={FILTER_NAME.DIRECTION}
          value={FILTER_VALUE.DIRECTION.TO}
          label="To Program"
          onSubmit={setFilters}
        />

        <Radio
          name={FILTER_NAME.DIRECTION}
          value={FILTER_VALUE.DIRECTION.FROM}
          label="From Program"
          onSubmit={setFilters}
        />
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
      renderFilters={renderFilters}
    />
  );
};

export { ProgramMessages };
