import SimpleBar from 'simplebar-react';

import { useScrollLoader } from 'hooks';
import { Placeholder } from 'entities/placeholder';
import { ICode, HorizontalCodeCard } from 'entities/code';
import { ExamplesLink } from 'shared/ui/examplesLink';
import CardPalceholderSVG from 'shared/assets/images/placeholders/card.svg?react';

import styles from './CodesList.module.scss';

type Props = {
  codes: ICode[];
  isLoading: boolean;
  totalCount: number;
  loadMorePrograms: () => void;
};

const CodesList = (props: Props) => {
  const { codes, isLoading, totalCount, loadMorePrograms } = props;

  const hasMore = !isLoading && codes.length < totalCount;
  const isEmpty = !(isLoading || totalCount);
  const isLoaderShowing = isEmpty || (!totalCount && isLoading);

  const scrollableNodeRef = useScrollLoader<HTMLDivElement>(loadMorePrograms, hasMore);

  return (
    <div className={styles.codesList}>
      {isLoaderShowing ? (
        <Placeholder
          block={<CardPalceholderSVG className={styles.placeholderBlock} />}
          title="There are no codes yet"
          description="You can start experimenting right now or try to build from examples. Let`s Rock!"
          isEmpty={isEmpty}
          blocksCount={4}>
          <ExamplesLink />
        </Placeholder>
      ) : (
        <SimpleBar className={styles.simpleBar} scrollableNodeProps={{ ref: scrollableNodeRef }}>
          {codes.map((code) => (
            <HorizontalCodeCard key={code.id} code={code} />
          ))}
        </SimpleBar>
      )}
    </div>
  );
};

export { CodesList };
