import { HexString } from '@gear-js/api';
import { parseAsString } from 'nuqs';
import { Sails } from 'sails-js';

import { DateFilter, Filters } from '@/features/filters';
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
  DATE_FROM: 'from',
  DATE_TO: 'to',
} as const;

const DEFAULT_VALUE = {
  SAILS: '' as string,
  DATE_FROM: '' as string,
  DATE_TO: '' as string,
} as const;

const DEFAULT_FILTER_VALUES = {
  [FILTER_NAME.SAILS]: DEFAULT_VALUE.SAILS,
  [FILTER_NAME.DATE_FROM]: DEFAULT_VALUE.DATE_FROM,
  [FILTER_NAME.DATE_TO]: DEFAULT_VALUE.DATE_TO,
} as const;

function useFilters(sails: Sails | undefined) {
  const [filters, setFilters] = useSearchParamsStates({
    [FILTER_NAME.SAILS]: parseAsString.withDefault(DEFAULT_VALUE.SAILS),

    // TODO: validate date strings
    [FILTER_NAME.DATE_FROM]: parseAsString.withDefault(DEFAULT_VALUE.DATE_FROM),
    [FILTER_NAME.DATE_TO]: parseAsString.withDefault(DEFAULT_VALUE.DATE_TO),
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

  const renderList = () => (
    <List
      items={events.data?.result}
      hasMore={events.hasNextPage}
      isLoading={events.isLoading}
      noItems={{ heading: 'There are no events yet.' }}
      size="small"
      fetchMore={events.fetchNextPage}
      renderItem={(event: EventType) => <EventCard programId={programId} event={event} sails={sails} />}
      renderSkeleton={() => <Skeleton SVG={CardPlaceholderSVG} disabled />}
    />
  );

  const renderFilters = () => {
    if (!sails) return;

    return (
      <Filters initialValues={DEFAULT_FILTER_VALUES} values={filterValues} onSubmit={setFilterValues}>
        <DateFilter fromName={FILTER_NAME.DATE_FROM} toName={FILTER_NAME.DATE_TO} onSubmit={setFilterValues} />

        <SailsFilter
          label="Sails Events"
          services={sails.services}
          type="events"
          name={FILTER_NAME.SAILS}
          onSubmit={setFilterValues}
        />
      </Filters>
    );
  };

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
