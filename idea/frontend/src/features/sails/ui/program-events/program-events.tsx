import { HexString } from '@gear-js/api';
import { useState } from 'react';
import { Sails } from 'sails-js';

import { FilterGroup, Filters, Radio } from '@/features/filters';
import { List, ProgramTabLayout, Skeleton } from '@/shared/ui';
import CardPlaceholderSVG from '@/shared/assets/images/placeholders/card.svg?react';

import { useEvents, EventType } from '../../api';
import { SailsService, SailsServiceEvent } from '../../types';
import { EventCard } from '../event-card';

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

  const renderFilterGroup = (
    heading: string,
    name: typeof FILTER_NAME[keyof typeof FILTER_NAME],
    data: Record<string, SailsService | SailsServiceEvent>,
    onSubmit: (values: typeof filterValues) => void = setFilterValues,
  ) => (
    <FilterGroup title={heading} name={name} onSubmit={onSubmit}>
      <Radio label="None" value="" name={name} onSubmit={onSubmit} />

      {Object.keys(data).map((fnName) => (
        <Radio key={fnName} value={fnName} label={fnName} name={name} onSubmit={onSubmit} />
      ))}
    </FilterGroup>
  );

  const renderFilters = () => {
    if (!sails) return null;

    const { services } = sails;
    const serviceName = filterValues[FILTER_NAME.SERVICE_NAME];

    const handleServiceNameChange = (values: typeof filterValues) =>
      setFilterValues({ ...values, [FILTER_NAME.EVENT_NAME]: '' });

    return (
      <Filters initialValues={DEFAULT_FILTER_VALUES} values={filterValues} onSubmit={setFilterValues}>
        {renderFilterGroup('Service', FILTER_NAME.SERVICE_NAME, services, handleServiceNameChange)}
        {serviceName && renderFilterGroup('Event', FILTER_NAME.EVENT_NAME, services[serviceName].events)}
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
