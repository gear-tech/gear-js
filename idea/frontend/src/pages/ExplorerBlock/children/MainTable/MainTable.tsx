import { Extrinsic } from '@polkadot/types/interfaces';

import styles from './MainTable.module.scss';
import commonStyles from '../../ExplorerBlock.module.scss';
import { Row } from './Row/Row';

import { EventRecords, IdeaEvent } from 'types/explorer';

type Props = {
  extrinsics: Extrinsic[];
  eventRecords: EventRecords;
};

const MainTable = ({ extrinsics, eventRecords }: Props) => {
  const isAnyExtrinsic = extrinsics.length > 0;

  const getExtrinsicEvents = (index: number) =>
    eventRecords
      .filter(({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index))
      .map(({ event }) => new IdeaEvent(event));

  const getRows = () =>
    // eslint-disable-next-line react/no-array-index-key
    extrinsics.map((extrinsic, index) => <Row key={index} extrinsic={extrinsic} events={getExtrinsicEvents(index)} />);

  return (
    <div className={styles.main}>
      <div className={commonStyles.header}>Extrinsics</div>
      <div className={commonStyles.header}>Events</div>
      <div className={commonStyles.header}>Weight</div>
      <div className={commonStyles.header}>Signer</div>
      {isAnyExtrinsic ? getRows() : <p className={commonStyles.message}>No extrinsics available.</p>}
    </div>
  );
};

export { MainTable };
