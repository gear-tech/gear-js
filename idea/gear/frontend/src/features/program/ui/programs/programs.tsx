import { LocalProgram } from '@/features/local-indexer';
import CardPlaceholderSVG from '@/shared/assets/images/placeholders/card.svg?react';
import { List, Skeleton } from '@/shared/ui';

import { Program } from '../../api';
import { ProgramCard } from '../program-card';

type Props = {
  items: Program[] | LocalProgram[] | undefined;
  isLoading: boolean;
  hasMore: boolean;
  noItemsSubheading?: string;
  vertical?: boolean;
  fetchMore: () => void;
};

function Programs({ vertical, noItemsSubheading, ...props }: Props) {
  const renderProgram = (program: Program | LocalProgram) => (
    <ProgramCard key={program.id} program={program} vertical={vertical} />
  );

  const renderSkeleton = () => <Skeleton SVG={CardPlaceholderSVG} disabled />;

  return (
    <List
      {...props}
      noItems={{ heading: 'There are no programs yet', subheading: noItemsSubheading }}
      renderItem={renderProgram}
      renderSkeleton={renderSkeleton}
    />
  );
}

export { Programs };
