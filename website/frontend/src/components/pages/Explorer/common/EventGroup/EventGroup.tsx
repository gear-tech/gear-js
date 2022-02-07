import React from 'react';
import { LogData } from '@gear-js/api';
import { IdeaEvents, Methods } from 'types/explorer';
import { ExpansionPanel } from 'components/pages/Explorer/common/ExpansionPanel/ExpansionPanel';
import { Content } from '../Content/Content';
import { LogContent } from '../LogContent/LogContent';

type Props = {
  group: IdeaEvents;
};

const EventGroup = ({ group }: Props) => {
  const [firstEvent] = group;
  const { method, caption, description, blockNumber } = firstEvent;
  const isLog = method === Methods.LOG;

  const getContent = () =>
    group.map((event) => {
      const { data, id } = event;
      return isLog ? <LogContent key={id} data={new LogData(data)} /> : <Content key={id} data={data} />;
    });

  return (
    <ExpansionPanel caption={caption} description={description} counter={group.length} blockNumber={blockNumber}>
      {getContent()}
    </ExpansionPanel>
  );
};

export { EventGroup };
