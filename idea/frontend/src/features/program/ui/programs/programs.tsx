import { List, Skeleton } from '@/shared/ui';
import CardPalceholderSVG from '@/shared/assets/images/placeholders/card.svg?react';

import { Program } from '../../api';
import { ProgramCard } from '../program-card';

type Props = {
  items: Program[] | undefined;
  isLoading: boolean;
  hasMore: boolean;
  noItemsSubheading?: string;
  vertical?: boolean;
  fetchMore: () => void;
};

function Programs({ vertical, noItemsSubheading, ...props }: Props) {
  const renderProgram = (program: Program) => <ProgramCard key={program.id} program={program} vertical={vertical} />;
  const renderSkeleton = () => <Skeleton SVG={CardPalceholderSVG} disabled />;

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
