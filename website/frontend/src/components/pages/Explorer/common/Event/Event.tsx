import React from 'react';
import { LogData } from '@gear-js/api';
import { Event as DotEvent } from '@polkadot/types/interfaces';
import { Methods } from 'types/explorer';
import { ExpansionPanel } from 'components/pages/Explorer/common/ExpansionPanel/ExpansionPanel';
import { Content } from '../Content/Content';
import { LogContent } from '../LogContent/LogContent';

type Props = {
  event: DotEvent;
  className?: string;
};

const Event = ({ event, className }: Props) => {
  const { method, section, meta, data } = event;
  const { docs } = meta;

  const caption = `${section}.${method}`;
  const description = docs.toHuman();

  const isLog = method === Methods.LOG;
  const content = isLog ? <LogContent data={new LogData(data)} /> : <Content data={data} />;

  return (
    <ExpansionPanel caption={caption} description={String(description)} className={className}>
      {content}
    </ExpansionPanel>
  );
};

export { Event };
