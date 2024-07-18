import { List, Skeleton } from '@/shared/ui';
import CardPalceholderSVG from '@/shared/assets/images/placeholders/card.svg?react';

import { Program } from '../../api';
import { ProgramCard } from '../program-card';

type Props = {
  items: Program[] | undefined;
  isLoading: boolean;
  hasMore: boolean;
  fetchMore: () => void;
  vertical?: boolean;
};

function Programs({ vertical, ...props }: Props) {
  const renderProgram = (program: Program) => <ProgramCard key={program.id} program={program} vertical={vertical} />;
  const renderSkeleton = () => <Skeleton SVG={CardPalceholderSVG} disabled />;

  return <List {...props} renderItem={renderProgram} renderSkeleton={renderSkeleton} />;
}

export { Programs };
