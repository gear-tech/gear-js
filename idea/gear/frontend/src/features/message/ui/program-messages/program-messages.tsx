import { HexString } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { parseAsString, parseAsStringEnum } from 'nuqs';
import { Sails } from 'sails-js';

import { FilterGroup, Filters, Radio } from '@/features/filters';
import { SailsFilter } from '@/features/sails/ui/sails-filter-group/sails-filter';
import { useChangeEffect, useSearchParamsStates } from '@/hooks';
import MessageCardPlaceholderSVG from '@/shared/assets/images/placeholders/horizontalMessageCard.svg?react';
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
  SAILS_FUNCTION: 'sailsFunction',
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

type OwnerValue = (typeof FILTER_VALUE.OWNER)[keyof typeof FILTER_VALUE.OWNER];
type DirectionValue = (typeof FILTER_VALUE.DIRECTION)[keyof typeof FILTER_VALUE.DIRECTION];

const VALUES = {
  OWNER: Object.values(FILTER_VALUE.OWNER),
  DIRECTION: Object.values(FILTER_VALUE.DIRECTION),
} as const;

const DEFAULT_VALUE = {
  OWNER: FILTER_VALUE.OWNER.ALL as OwnerValue,
  DIRECTION: FILTER_VALUE.DIRECTION.TO as DirectionValue,
  SAILS_FUNCTION: '' as string,
} as const;

const DEFAULT_FILTER_VALUES = {
  [FILTER_NAME.OWNER]: DEFAULT_VALUE.OWNER,
  [FILTER_NAME.DIRECTION]: DEFAULT_VALUE.DIRECTION,
  [FILTER_NAME.SAILS_FUNCTION]: DEFAULT_VALUE.SAILS_FUNCTION,
} as const;

function useFilters(sails: Sails | undefined) {
  const { account } = useAccount();

  // fallback to default value on no account,
  // nuqs parser doesn't support dynamic values - it works because there's app level loader for account
  const ownerValues = account ? VALUES.OWNER : [DEFAULT_VALUE.OWNER];

  const serviceNames = Object.keys(sails?.services ?? {});
  const serviceNameValues = [DEFAULT_VALUE.SAILS_FUNCTION, ...serviceNames];

  const [filters, setFilters] = useSearchParamsStates({
    [FILTER_NAME.OWNER]: parseAsStringEnum(ownerValues).withDefault(DEFAULT_VALUE.OWNER),
    [FILTER_NAME.DIRECTION]: parseAsStringEnum(VALUES.DIRECTION).withDefault(DEFAULT_VALUE.DIRECTION),
    [FILTER_NAME.SAILS_FUNCTION]: parseAsString.withDefault(DEFAULT_VALUE.SAILS_FUNCTION),
  });

  const [serviceName, functionName = ''] = filters[FILTER_NAME.SAILS_FUNCTION].split('.');

  const functionNames = Object.keys(sails?.services?.[serviceName]?.functions ?? {});
  const functionNameValues = [DEFAULT_VALUE.SAILS_FUNCTION, ...functionNames];

  // validating service and function names because nuqs parsers don't support dynamic values
  const validFilters = {
    ...filters,

    [FILTER_NAME.SAILS_FUNCTION]:
      serviceNameValues.includes(serviceName) && functionNameValues.includes(functionName)
        ? filters[FILTER_NAME.SAILS_FUNCTION]
        : DEFAULT_VALUE.SAILS_FUNCTION,
  };

  useChangeEffect(() => {
    if (!account) void setFilters((prevValues) => ({ ...prevValues, [FILTER_NAME.OWNER]: DEFAULT_VALUE.OWNER }));
  }, [account]);

  return [validFilters, setFilters] as const;
}

const ProgramMessages = ({ programId, sails }: Props) => {
  const { account } = useAccount();
  const [filters, setFilters] = useFilters(sails);

  const isToDirection = filters[FILTER_NAME.DIRECTION] === FILTER_VALUE.DIRECTION.TO;
  const addressParam = filters[FILTER_NAME.OWNER] === FILTER_VALUE.OWNER.OWNER ? account?.decodedAddress : undefined;
  const [service, fn] = filters[FILTER_NAME.SAILS_FUNCTION].split('.');

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

    return (
      <SailsFilter
        label="Sails Functions"
        services={sails.services}
        type="functions"
        name={FILTER_NAME.SAILS_FUNCTION}
        onSubmit={(values: typeof filters) => setFilters(values)}
      />
    );
  };

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
