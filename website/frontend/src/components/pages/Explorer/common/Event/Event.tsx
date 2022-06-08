import React from 'react';
import { LogData } from '@gear-js/api';
import { IdeaEvent, IdeaEvents, Methods } from 'types/explorer';
import { ExpansionPanel } from 'components/pages/Explorer/common/ExpansionPanel/ExpansionPanel';
import { Content } from './children/Content/Content';
import { LogContent } from './children/LogContent/LogContent';

type Props = {
  value: IdeaEvent | IdeaEvents;
  className?: string;
};

const Event = ({ value, className }: Props) => {
  const isGroup = Array.isArray(value);

  const event = isGroup ? value[0] : value;
  const { method, caption, description, blockNumber } = event;

  const counter = isGroup ? value.length : undefined;

  //  TODOEVENTS:  log поменять на userMessageSent
  const isLog = method === Methods.LOG;

  const getContent = ({ id, data }: IdeaEvent = event) =>
    // //  TODOEVENTS:  new userMessageSentData
    isLog ? <LogContent key={id} data={new LogData(data)} /> : <Content key={id} data={data} />;

  const getBody = () => (isGroup ? value.map(getContent) : getContent());

  return (
    <ExpansionPanel
      caption={caption}
      description={description}
      className={className}
      counter={counter}
      blockNumber={blockNumber}
    >
      {getBody()}
    </ExpansionPanel>
  );
};

export { Event };
