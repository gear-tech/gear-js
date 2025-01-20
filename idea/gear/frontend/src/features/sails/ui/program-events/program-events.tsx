import { HexString } from '@gear-js/api';
import { useState } from 'react';
import { Sails } from 'sails-js';

import { Filters } from '@/features/filters';
import { List, ProgramTabLayout, Skeleton } from '@/shared/ui';
import CardPlaceholderSVG from '@/shared/assets/images/placeholders/card.svg?react';

import { useEvents, EventType } from '../../api';
import { EventCard } from '../event-card';
import { SailsFilterGroup } from '../sails-filter-group';

type Props = {
  programId: HexString;
  sails: Sails | undefined;
};

const FILTER_NAME = {
  SERVICE_NAME: 'serviceName',
  EVENT_NAME: 'eventName',
} as const;

const DEFAULT_FILTER_VALUES = {
  [FILTER_NAME.SERVICE_NAME]: '',
  [FILTER_NAME.EVENT_NAME]: '',
};

function ProgramEvents({ programId, sails }: Props) {
  const [filterValues, setFilterValues] = useState(DEFAULT_FILTER_VALUES);

  const events = useEvents({
    source: programId,
    service: filterValues[FILTER_NAME.SERVICE_NAME],
    name: filterValues[FILTER_NAME.EVENT_NAME],
  });

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
    if (!sails) return null;

    const { services } = sails;
    const serviceName = filterValues[FILTER_NAME.SERVICE_NAME];

    const handleServiceNameChange = (values: typeof filterValues) =>
      setFilterValues({ ...values, [FILTER_NAME.EVENT_NAME]: '' });

    return (
      <Filters initialValues={DEFAULT_FILTER_VALUES} values={filterValues} onSubmit={setFilterValues}>
        <SailsFilterGroup
          heading="Service"
          name={FILTER_NAME.SERVICE_NAME}
          functions={services}
          onSubmit={handleServiceNameChange}
        />

        {serviceName && (
          <SailsFilterGroup
            heading="Event"
            name={FILTER_NAME.EVENT_NAME}
            functions={serviceName ? services[serviceName].events : undefined}
            onSubmit={setFilterValues}
          />
        )}
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
