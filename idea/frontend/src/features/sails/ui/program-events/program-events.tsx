import { HexString } from '@gear-js/api';
import { useMemo, useState } from 'react';
import { Sails } from 'sails-js';

import { FilterGroup, Filters, Radio } from '@/features/filters';
import { List, ProgramTabLayout, Skeleton } from '@/shared/ui';
import CardPlaceholderSVG from '@/shared/assets/images/placeholders/card.svg?react';

import { useEvents, EventType } from '../../api';
import { EventCard } from '../event-card';

type Props = {
  programId: HexString;
  sails: Sails | undefined;
};

const FILTER_NAME = {
  METHOD: 'method',
} as const;

const DEFAULT_FILTER_VALUES = {
  [FILTER_NAME.METHOD]: '',
};

function ProgramEvents({ programId, sails }: Props) {
  const [filterValues, setFilterValues] = useState(DEFAULT_FILTER_VALUES);

  const filterParams = useMemo(() => {
    const [service, name] = filterValues[FILTER_NAME.METHOD].split('.');

    return { service, name };
  }, [filterValues]);

  const methods = useMemo(() => {
    if (!sails) return;

    return Object.entries(sails.services).flatMap(([name, service]) =>
      Object.keys(service.events).map((eventName) => `${name}.${eventName}`),
    );
  }, [sails]);

  const events = useEvents({ source: programId, ...filterParams });

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

  const renderFilters = () =>
    methods?.length ? (
      <Filters initialValues={filterValues} onSubmit={setFilterValues}>
        <FilterGroup name={FILTER_NAME.METHOD} onSubmit={setFilterValues}>
          <Radio label="None" name={FILTER_NAME.METHOD} value="" onSubmit={setFilterValues} />

          {methods.map((method) => (
            <Radio key={method} name={FILTER_NAME.METHOD} value={method} label={method} onSubmit={setFilterValues} />
          ))}
        </FilterGroup>
      </Filters>
    ) : null;

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
