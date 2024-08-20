import { HexString } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';
import { Sails } from 'sails-js';

import MessageCardPlaceholderSVG from '@/shared/assets/images/placeholders/horizontalMessageCard.svg?react';
import { FilterGroup, Filters, Radio } from '@/features/filters';
import { SailsService, SailsServiceFunc } from '@/features/sails';
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

  const [filters, setFilters] = useState(DEFAULT_FILTER_VALUES);

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

    const renderFilterGroup = (
      heading: string,
      name: typeof FILTER_NAME[keyof typeof FILTER_NAME],
      data: Record<string, SailsService | SailsServiceFunc>,
      onSubmit: (values: typeof filters) => void = setFilters,
    ) => (
      <FilterGroup title={heading} name={name} onSubmit={onSubmit}>
        <Radio label="None" value="" name={name} onSubmit={onSubmit} />

        {Object.keys(data).map((fnName) => (
          <Radio key={fnName} value={fnName} label={fnName} name={name} onSubmit={onSubmit} />
        ))}
      </FilterGroup>
    );

    return (
      <>
        {renderFilterGroup('Service', FILTER_NAME.SERVICE_NAME, services, handleServiceNameChange)}
        {serviceName && renderFilterGroup('Function', FILTER_NAME.FUNCTION_NAME, services[serviceName].functions)}
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
