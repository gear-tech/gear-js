import React from 'react';
import { LogData } from '@gear-js/api';
import { EventGroup as EventGroupType, Methods } from 'types/explorer';
import { ExpansionPanel } from 'components/pages/Explorer/common/ExpansionPanel/ExpansionPanel';
import { Content } from '../Content/Content';
import { LogContent } from '../LogContent/LogContent';

type Props = {
  group: EventGroupType;
};

const EventGroup = ({ group }: Props) => {
  const { method, caption, description, blockNumber, list } = group;
  const isLog = method === Methods.LOG;

  const getContent = () =>
    list.map((event) => {
      const { data, hash } = event;
      const id = hash.toHex();

      return isLog ? <LogContent key={id} data={new LogData(data)} /> : <Content key={id} data={data} />;
    });

  return (
    <ExpansionPanel caption={caption} description={String(description)} counter={list.length} blockNumber={blockNumber}>
      {getContent()}
    </ExpansionPanel>
  );
};

export { EventGroup };
