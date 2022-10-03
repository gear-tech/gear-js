import { Extrinsic } from '@polkadot/types/interfaces';
import { Vec } from '@polkadot/types';
import { FrameSystemEventRecord } from '@polkadot/types/lookup';
import clsx from 'clsx';

import { IdeaEvent } from 'entities/explorer';

import { BlockTablePlaceholder } from '../blockTablePlaceholder';
import { Row } from '../row';
import commonStyles from '../Explorer.module.scss';
import styles from './MainTable.module.scss';

type Props = {
  extrinsics: Extrinsic[] | undefined;
  eventRecords: Vec<FrameSystemEventRecord> | undefined;
  isLoading: boolean;
};

const MainTable = ({ extrinsics, eventRecords, isLoading }: Props) => {
  const isAnyExtrinsic = extrinsics && extrinsics.length > 0;
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
        {isLoading ? (
          <BlockTablePlaceholder />
        ) : (
          <>
            {isAnyExtrinsic && getRows()}
            {!isAnyExtrinsic && <p className={commonStyles.message}>No extrinsics available.</p>}
          </>
        )}
      </div>
    </div>
  );
};

export { MainTable };
