import React from 'react';
import { Event as DotEvent, Extrinsic as DotExtrinsic } from '@polkadot/types/interfaces';
import { Extrinsic } from './children/Extrinsic/Extrinsic';
import { Event } from './children/Event/Event';
import styles from './Row.module.scss';

type Props = {
  extrinsic: DotExtrinsic;
  events: DotEvent[];
};

const Row = ({ extrinsic, events }: Props) => {
  const getEvents = () => events.map((event, index) => <Event key={index} event={event} />);

  return (
    <>
      <div>
        <Extrinsic extrinsic={extrinsic} />
      </div>
      <div>{getEvents()}</div>
      <div></div>
      <div></div>
    </>
  );
};

export { Row };
