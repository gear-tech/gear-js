import { useState } from 'react';
import { HexString } from '@gear-js/api';

import { List, ProgramTabLayout, SearchForm, Skeleton } from '@/shared/ui';
import CardPlaceholderSVG from '@/shared/assets/images/placeholders/card.svg?react';

import { useEvents, EventType } from '../../api';
import { EventCard } from '../event-card';

type Props = {
  programId: HexString;
};

function ProgramEvents({ programId }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const events = useEvents({ source: programId, name: searchQuery });

  const renderEvent = (event: EventType) => <EventCard event={event} />;
  const renderEventSkeleton = () => <Skeleton SVG={CardPlaceholderSVG} disabled />;

  const renderList = () => (
    <List
      items={events.data?.result}
      hasMore={events.hasNextPage}
      isLoading={events.isLoading}
      fetchMore={events.fetchNextPage}
      renderItem={renderEvent}
      renderSkeleton={renderEventSkeleton}
    />
  );

  const renderSearch = () => <SearchForm placeholder="Search by name..." onSubmit={setSearchQuery} />;

  return (
    <ProgramTabLayout heading="Events" count={events.data?.count} renderList={renderList} renderSearch={renderSearch} />
  );
}

export { ProgramEvents };
