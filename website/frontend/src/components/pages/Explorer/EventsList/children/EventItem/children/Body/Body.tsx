import React from 'react';
import { LogData } from '@gear-js/api';
import { Event } from '@polkadot/types/interfaces';
import { Content } from './children/Content/Content';
import { LogContent } from './children/LogContent/LogContent';
import styles from './Body.module.scss';

type Props = {
  method: string;
  events: Event[];
};

const Body = ({ method, events }: Props) => {
  const isLog = method === 'Log';

  const getContent = () =>
    events.map((event, index) => {
      const { data } = event;
      return isLog ? <LogContent key={index} data={new LogData(data)} /> : <Content key={index} data={data} />;
    });

  return <div className={styles.body}>{getContent()}</div>;
};

export { Body };
