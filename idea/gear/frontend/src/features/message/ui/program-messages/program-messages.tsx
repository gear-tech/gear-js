import { HexString } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { parseAsStringEnum } from 'nuqs';
import { useEffect } from 'react';
import { Sails } from 'sails-js';

import { FilterGroup, Filters, Radio } from '@/features/filters';
import { SailsFilterGroup } from '@/features/sails';
import { useSearchParamsState, useSearchParamsStates } from '@/hooks';
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

type OwnerValue = (typeof FILTER_VALUE.OWNER)[keyof typeof FILTER_VALUE.OWNER];
type DirectionValue = (typeof FILTER_VALUE.DIRECTION)[keyof typeof FILTER_VALUE.DIRECTION];

const DEFAULT_FILTER_VALUES = {
  [FILTER_NAME.OWNER]: FILTER_VALUE.OWNER.ALL as OwnerValue,
  [FILTER_NAME.DIRECTION]: FILTER_VALUE.DIRECTION.TO as DirectionValue,
  [FILTER_NAME.SERVICE_NAME]: '',
  [FILTER_NAME.FUNCTION_NAME]: '',
};

function useFilters(sails: Sails | undefined) {
  const { account } = useAccount();

  const [baseFilters, setBaseFilters] = useSearchParamsStates({
    [FILTER_NAME.OWNER]: parseAsStringEnum(Object.values(FILTER_VALUE.OWNER)).withDefault(
      DEFAULT_FILTER_VALUES[FILTER_NAME.OWNER],
    ),

    [FILTER_NAME.DIRECTION]: parseAsStringEnum(Object.values(FILTER_VALUE.DIRECTION)).withDefault(
      DEFAULT_FILTER_VALUES[FILTER_NAME.DIRECTION],
    ),

    [FILTER_NAME.SERVICE_NAME]: parseAsStringEnum(['', ...Object.keys(sails?.services ?? {})]).withDefault(
      DEFAULT_FILTER_VALUES[FILTER_NAME.SERVICE_NAME],
    ),
  });

  const [functionName, setFunctionName] = useSearchParamsState(
    FILTER_NAME.FUNCTION_NAME,
    parseAsStringEnum([
      '',
      ...Object.keys(sails?.services?.[baseFilters[FILTER_NAME.SERVICE_NAME]]?.functions ?? {}),
    ]).withDefault(DEFAULT_FILTER_VALUES[FILTER_NAME.FUNCTION_NAME]),
  );

  const filters = { ...baseFilters, functionName };

  const setFilters = ({ functionName: _functionName, ...values }: typeof DEFAULT_FILTER_VALUES) => {
    void setBaseFilters(values);
    void setFunctionName(_functionName);
  };

  useEffect(() => {
    if (!account)
      void setBaseFilters((prevValues) => ({
        ...prevValues,
        [FILTER_NAME.OWNER]: DEFAULT_FILTER_VALUES[FILTER_NAME.OWNER],
      }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return [filters, setFilters] as const;
}

const ProgramMessages = ({ programId, sails }: Props) => {
  const { account } = useAccount();
  const [filters, setFilters] = useFilters(sails);

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
