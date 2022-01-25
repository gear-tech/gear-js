import React from 'react';
import { LogData } from '@gear-js/api';
import { Event } from '@polkadot/types/interfaces';
import { generateRandomId } from 'helpers';
import { Content } from './children/Content/Content';
import { LogContent } from './children/LogContent/LogContent';
import styles from './Body.module.scss';

type Props = {
  method: string;
  group: Event[];
};

const Body = ({ method, group }: Props) => {
  const isLog = method === 'Log';

  const getContent = () =>
    group.map((event) => {
      const { data } = event;
      const id = generateRandomId();

      // TOFIX: temporary ID solution
      return isLog ? <LogContent key={id} data={new LogData(data)} /> : <Content key={id} data={data} />;
    });

  return <div className={styles.body}>{getContent()}</div>;
};

export { Body };
