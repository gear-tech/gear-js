import { Extrinsic , EventRecord } from '@polkadot/types/interfaces';
import { Vec } from '@polkadot/types';
import clsx from 'clsx';

import { IdeaEvent } from 'entities/explorer';
import { Placeholder } from 'entities/placeholder';
import { ReactComponent as MainTablePlaceholderSVG } from 'shared/assets/images/placeholders/blockMainTablePlaceholder.svg';

import { Row } from '../row';
import commonStyles from '../Explorer.module.scss';
import styles from './MainTable.module.scss';

type Props = {
  extrinsics: Extrinsic[] | undefined;
  eventRecords: Vec<EventRecord> | undefined;
  error: string;
};

const MainTable = ({ extrinsics, eventRecords, error }: Props) => {
  const isAnyExtrinsic = extrinsics && extrinsics.length > 0;
  const isListEmpty = extrinsics?.length === 0;

  const headerClassName = clsx(commonStyles.header, styles.header);

  const getExtrinsicEvents = (index: number) =>
    eventRecords
      ?.filter(({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index))
      .map(({ event }) => new IdeaEvent(event));

  const getRows = () =>
    extrinsics?.map((extrinsic, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <Row key={index} extrinsic={extrinsic} events={getExtrinsicEvents(index)} />
    ));

  return (
    <div>
      <header className={headerClassName}>
        <span>Extrinsics</span>
        <span>Events</span>
        <span className={commonStyles.alignRight}>Weight</span>
        <span className={commonStyles.alignRight}>Signer</span>
      </header>
      <div className={commonStyles.body}>
        {isAnyExtrinsic ? (
          getRows()
        ) : (
          <Placeholder
            block={<MainTablePlaceholderSVG />}
            title="There are no events yet"
            description={error || 'The list is empty while there are no events'}
            isEmpty={isListEmpty || !!error}
          />
        )}
      </div>
    </div>
  );
};

export { MainTable };
