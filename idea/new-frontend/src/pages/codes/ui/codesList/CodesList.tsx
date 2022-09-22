import SimpleBar from 'simplebar-react';

import { useScrollLoader } from 'hooks';
import { Placeholder } from 'entities/placeholder';
import { ICode, HorizontalCodeCard } from 'entities/code';
import { ExamplesLink } from 'shared/ui/examplesLink';
import { ReactComponent as HorizontalCodeCardSVG } from 'shared/assets/images/placeholders/horizontalProgramCard.svg';

import clsx from 'clsx';
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
      <SimpleBar
        className={clsx(styles.simpleBar, isLoaderShowing && styles.noOverflow)}
        scrollableNodeProps={{ ref: scrollableNodeRef }}>
        {isLoaderShowing ? (
          <Placeholder
            block={<HorizontalCodeCardSVG className={styles.placeholderBlock} />}
            title="There is no codes yet"
            description="You can start experimenting right now or try to build from examples. Let`s Rock!"
            isEmpty={isEmpty}
            blocksCount={8}>
            <ExamplesLink />
          </Placeholder>
        ) : (
          codes.map((code) => <HorizontalCodeCard key={code.id} code={code} />)
        )}
      </SimpleBar>
    </div>
  );
};

export { CodesList };
