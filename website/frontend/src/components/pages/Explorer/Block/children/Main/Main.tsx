import React from 'react';
import { Vec } from '@polkadot/types';
import { FrameSystemEventRecord } from '@polkadot/types/lookup';
import { Extrinsic } from '@polkadot/types/interfaces';
import { Row } from './Row/Row';
import commonStyles from '../../Block.module.scss';
import styles from './Main.module.scss';

type Props = {
  extrinsics: Extrinsic[];
  eventRecords: Vec<FrameSystemEventRecord>;
};

const Main = ({ extrinsics, eventRecords }: Props) => {
  const getExtrinsicEvents = (index: number) =>
    eventRecords
      .filter(({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index))
      .map(({ event }) => event);

  const getRows = () =>
    extrinsics.map((extrinsic, index) => <Row key={index} extrinsic={extrinsic} events={getExtrinsicEvents(index)} />);

  return (
    <div className={styles.main}>
      <div className={commonStyles.header}>Extrinsics</div>
      <div className={commonStyles.header}>Events</div>
      <div className={commonStyles.header}>Weight</div>
      <div className={commonStyles.header}>Signer</div>
      {getRows()}
    </div>
  );
};

export { Main };
