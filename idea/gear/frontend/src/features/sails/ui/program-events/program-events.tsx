import { HexString } from '@gear-js/api';
import { parseAsString } from 'nuqs';
import { Sails } from 'sails-js';

import { DateFilter, Filters, parseAsIsoString } from '@/features/filters';
import { useIsVftProgram } from '@/features/vft-whitelist';
import { useSearchParamsStates } from '@/hooks';
import CardPlaceholderSVG from '@/shared/assets/images/placeholders/card.svg?react';
import { List, ProgramTabLayout, Skeleton } from '@/shared/ui';

import { useEvents, EventType } from '../../api';
import { getParsedSailsFilterValue, getValidSailsFilterValue } from '../../utils';
import { EventCard } from '../event-card';
import { SailsFilter } from '../sails-filter';

type Props = {
  programId: HexString;
  sails: Sails | undefined;
};

const FILTER_NAME = {
  SAILS: 'sails',
  FROM_DATE: 'from',
  TO_DATE: 'to',
} as const;

const DEFAULT_VALUE = {
  SAILS: '' as string,
  FROM_DATE: '' as string,
  TO_DATE: '' as string,
} as const;

const DEFAULT_FILTER_VALUES = {
  [FILTER_NAME.SAILS]: DEFAULT_VALUE.SAILS,
  [FILTER_NAME.FROM_DATE]: DEFAULT_VALUE.FROM_DATE,
  [FILTER_NAME.TO_DATE]: DEFAULT_VALUE.TO_DATE,
} as const;

function useFilters(sails: Sails | undefined) {
  const [filters, setFilters] = useSearchParamsStates({
    [FILTER_NAME.SAILS]: parseAsString.withDefault(DEFAULT_VALUE.SAILS),
    [FILTER_NAME.FROM_DATE]: parseAsIsoString.withDefault(DEFAULT_VALUE.FROM_DATE),
    [FILTER_NAME.TO_DATE]: parseAsIsoString.withDefault(DEFAULT_VALUE.TO_DATE),
  });

  const validFilters = {
    ...filters,
    [FILTER_NAME.SAILS]: getValidSailsFilterValue(sails, 'events', filters[FILTER_NAME.SAILS], DEFAULT_VALUE.SAILS),
  };

  return [validFilters, setFilters] as const;
}

function ProgramEvents({ programId, sails }: Props) {
  const [filterValues, setFilterValues] = useFilters(sails);
  const { from, to } = filterValues;
  const { serviceName, functionName } = getParsedSailsFilterValue(filterValues[FILTER_NAME.SAILS]);

  const events = useEvents({ source: programId, service: serviceName, name: functionName, from, to });
  const { data: isVft } = useIsVftProgram(programId);

  // temporary workaround to hide duplicate events from service that bridge vft program idl lacks
  const getNonUtilityVftEvents = () => events.data?.result.filter((event) => event.service?.toLowerCase() !== 'vft2');

  const renderList = () => (
    <List
      items={isVft ? getNonUtilityVftEvents() : events.data?.result}
      hasMore={events.hasNextPage}
      isLoading={events.isLoading}
      noItems={{ heading: 'There are no events yet.' }}
      size="small"
      fetchMore={events.fetchNextPage}
      renderItem={(event: EventType) => <EventCard programId={programId} event={event} sails={sails} isVft={isVft} />}
      renderSkeleton={() => <Skeleton SVG={CardPlaceholderSVG} disabled />}
    />
  );

  const renderFilters = () => (
    <Filters initialValues={DEFAULT_FILTER_VALUES} values={filterValues} onSubmit={setFilterValues}>
      <DateFilter fromName={FILTER_NAME.FROM_DATE} toName={FILTER_NAME.TO_DATE} onSubmit={setFilterValues} />

      {sails && (
        <SailsFilter
          label="Sails Events"
          services={sails.services}
          type="events"
          name={FILTER_NAME.SAILS}
          onSubmit={setFilterValues}
        />
      )}
    </Filters>
  );

  return (
    <ProgramTabLayout
      heading="Events"
      count={events.data?.count}
      renderList={renderList}
      renderFilters={renderFilters}
    />
  );
}

export { ProgramEvents };
