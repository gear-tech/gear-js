import { HexString } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';
import { Sails } from 'sails-js';

import MessageCardPlaceholderSVG from '@/shared/assets/images/placeholders/horizontalMessageCard.svg?react';
import { FilterGroup, Filters, Radio } from '@/features/filters';
import { List, ProgramTabLayout, Skeleton } from '@/shared/ui';
import { SailsFilterGroup } from '@/features/sails';

import { useMessagesToProgram, useMessagesFromProgram } from '../../api';
import { MessageCard } from '../message-card';
import { useSearchParams } from 'react-router-dom';

type Props = {
  programId: HexString;
  sails: Sails | undefined;
};

const FILTER_NAME = {
  OWNER: 'owner',
  DIRECTION: 'direction',
  SERVICE_NAME: 'serviceName',
  FUNCTION_NAME: 'functionName',
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

type OwnerValue = typeof FILTER_VALUE.OWNER[keyof typeof FILTER_VALUE.OWNER];
type DirectionValue = typeof FILTER_VALUE.DIRECTION[keyof typeof FILTER_VALUE.DIRECTION];

const DEFAULT_FILTER_VALUES = {
  [FILTER_NAME.OWNER]: FILTER_VALUE.OWNER.ALL as OwnerValue,
  [FILTER_NAME.DIRECTION]: FILTER_VALUE.DIRECTION.TO as DirectionValue,
  [FILTER_NAME.SERVICE_NAME]: '',
  [FILTER_NAME.FUNCTION_NAME]: '',
};

const ProgramMessages = ({ programId, sails }: Props) => {
  const { account } = useAccount();

  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      [FILTER_NAME.OWNER]: params[FILTER_NAME.OWNER] || DEFAULT_FILTER_VALUES[FILTER_NAME.OWNER],
      [FILTER_NAME.DIRECTION]: params[FILTER_NAME.DIRECTION] || DEFAULT_FILTER_VALUES[FILTER_NAME.DIRECTION],
      [FILTER_NAME.SERVICE_NAME]: params[FILTER_NAME.SERVICE_NAME] || DEFAULT_FILTER_VALUES[FILTER_NAME.SERVICE_NAME],
      [FILTER_NAME.FUNCTION_NAME]:
        params[FILTER_NAME.FUNCTION_NAME] || DEFAULT_FILTER_VALUES[FILTER_NAME.FUNCTION_NAME],
    };
  });

  useEffect(() => {
    Object.entries(filters).forEach(([key, value]) => {
      if (key in DEFAULT_FILTER_VALUES && value) {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
    });
    setSearchParams(searchParams, { replace: true });
  }, [filters]);

  const isToDirection = filters[FILTER_NAME.DIRECTION] === FILTER_VALUE.DIRECTION.TO;
  const addressParam = filters[FILTER_NAME.OWNER] === FILTER_VALUE.OWNER.OWNER ? account?.decodedAddress : undefined;
  const service = filters[FILTER_NAME.SERVICE_NAME];
  const fn = filters[FILTER_NAME.FUNCTION_NAME];

  const toMessages = useMessagesToProgram({ destination: programId, source: addressParam, service, fn }, isToDirection);
  const fromMessages = useMessagesFromProgram(
    { source: programId, destination: addressParam, service, fn },
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

  const renderSailsFilters = () => {
    if (!sails) return null;

    const { services } = sails;
    const serviceName = filters[FILTER_NAME.SERVICE_NAME];

    const handleServiceNameChange = (values: typeof filters) =>
      setFilters({ ...values, [FILTER_NAME.FUNCTION_NAME]: '' });

    return (
      <>
        <SailsFilterGroup
          heading="Service"
          name={FILTER_NAME.SERVICE_NAME}
          functions={services}
          onSubmit={handleServiceNameChange}
        />

        {serviceName && (
          <SailsFilterGroup
            heading="Function"
            name={FILTER_NAME.FUNCTION_NAME}
            functions={services[serviceName].functions}
            onSubmit={setFilters}
          />
        )}
      </>
    );
  };

  useEffect(() => {
    if (!account) setFilters((prevValues) => ({ ...prevValues, [FILTER_NAME.OWNER]: FILTER_VALUE.OWNER.ALL }));
  }, [account]);

  const renderFilters = () => (
    <Filters initialValues={DEFAULT_FILTER_VALUES} values={filters} onSubmit={setFilters}>
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

      {renderSailsFilters()}
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
