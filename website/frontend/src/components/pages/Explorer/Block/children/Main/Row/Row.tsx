import React from 'react';
import { Event as DotEvent, Extrinsic as DotExtrinsic } from '@polkadot/types/interfaces';
import { Extrinsic } from './Extrinsic/Extrinsic';
import { Event } from '../../Event/Event';
import styles from './Row.module.scss';

type Props = {
  extrinsic: DotExtrinsic;
  events: DotEvent[];
};

const Row = ({ extrinsic, events }: Props) => {
  const getEvents = () => events.map((event, index) => <Event key={index} event={event} />);

  return (
    <>
      <div className={styles.cell}>
        <Extrinsic extrinsic={extrinsic} />
      </div>
      <div className={styles.cell}>{getEvents()}</div>
      <div className={styles.cell}></div>
      <div className={styles.cell}></div>
    </>
  );
};

export { Row };
