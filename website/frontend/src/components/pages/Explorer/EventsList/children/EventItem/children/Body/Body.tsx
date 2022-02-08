import React from 'react';
import { LogData } from '@gear-js/api';
import { Event } from '@polkadot/types/interfaces';
import { Methods } from 'types/events-list';
import { Content } from './children/Content/Content';
import { LogContent } from './children/LogContent/LogContent';
import styles from './Body.module.scss';

type Props = {
  method: string;
  list: Event[];
};

const Body = ({ method, list }: Props) => {
  const isLog = method === Methods.LOG;

  const getContent = () =>
    list.map((event) => {
      const { data, hash } = event;
      const id = hash.toHex();

      return isLog ? <LogContent key={id} data={new LogData(data)} /> : <Content key={id} data={data} />;
    });

  return <div className={styles.body}>{getContent()}</div>;
};

export { Body };
