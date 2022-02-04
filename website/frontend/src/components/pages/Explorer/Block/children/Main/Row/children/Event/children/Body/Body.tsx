import React from 'react';
import { LogData } from '@gear-js/api';
import { GenericEventData } from '@polkadot/types';
import { Methods } from 'types/explorer';
import { Content } from './children/Content/Content';
import { LogContent } from './children/LogContent/LogContent';
import styles from './Body.module.scss';

type Props = {
  method: string;
  data: GenericEventData;
};

const Body = ({ method, data }: Props) => {
  const isLog = method === Methods.LOG;
  return <div className={styles.body}>{isLog ? <LogContent data={new LogData(data)} /> : <Content data={data} />}</div>;
};

export { Body };
