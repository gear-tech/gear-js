import { HexString } from '@gear-js/api';
import { parseAsString } from 'nuqs';
import { Sails } from 'sails-js';

import { Filters } from '@/features/filters';
import { useSearchParamsStates } from '@/hooks';
import CardPlaceholderSVG from '@/shared/assets/images/placeholders/card.svg?react';
import { List, ProgramTabLayout, Skeleton } from '@/shared/ui';

import { useEvents, EventType } from '../../api';
import { getValidSailsFilterValue } from '../../utils';
import { EventCard } from '../event-card';
import { SailsFilter } from '../sails-filter';

type Props = {
  programId: HexString;
  sails: Sails | undefined;
};

const FILTER_NAME = {
  SAILS: 'sails',
} as const;

const DEFAULT_VALUE = {
  SAILS: '' as string,
} as const;

const DEFAULT_FILTER_VALUES = {
  [FILTER_NAME.SAILS]: DEFAULT_VALUE.SAILS,
} as const;

function useFilters(sails: Sails | undefined) {
  const [filters, setFilters] = useSearchParamsStates({
    [FILTER_NAME.SAILS]: parseAsString.withDefault(DEFAULT_VALUE.SAILS),
  });

  const validFilters = {
    [FILTER_NAME.SAILS]: getValidSailsFilterValue(sails, 'events', filters[FILTER_NAME.SAILS], DEFAULT_VALUE.SAILS),
  };

  return [validFilters, setFilters] as const;
}

function ProgramEvents({ programId, sails }: Props) {
  const [filterValues, setFilterValues] = useFilters(sails);
  const [service, name] = filterValues[FILTER_NAME.SAILS].split('.');

  const events = useEvents({ source: programId, service, name });

  const renderList = () => (
    <List
      items={events.data?.result}
      hasMore={events.hasNextPage}
      isLoading={events.isLoading}
      noItems={{ heading: 'There are no events yet.' }}
      size="small"
      fetchMore={events.fetchNextPage}
      renderItem={(event: EventType) => <EventCard event={event} sails={sails} />}
      renderSkeleton={() => <Skeleton SVG={CardPlaceholderSVG} disabled />}
    />
  );

  const renderFilters = () => {
    if (!sails) return;

    return (
      <Filters initialValues={DEFAULT_FILTER_VALUES} values={filterValues} onSubmit={setFilterValues}>
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
