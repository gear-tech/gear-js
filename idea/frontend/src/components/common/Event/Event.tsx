import { UserMessageSentData } from '@gear-js/api';

import { Pre } from '../Pre';
import { LogContent } from './children/LogContent/LogContent';
import { ExpansionPanel } from '../ExpansionPanel/ExpansionPanel';

import { IdeaEvent, IdeaEvents, Method } from 'types/explorer';

type Props = {
  value: IdeaEvent | IdeaEvents;
  className?: string;
};

const Event = ({ value, className }: Props) => {
  const isGroup = Array.isArray(value);

  const event = isGroup ? value[0] : value;
  const { method, caption, description, blockNumber } = event;

  const counter = isGroup ? value.length : undefined;

  const isLog = method === Method.UserMessageSent;

  const getContent = ({ id, data }: IdeaEvent = event) =>
    isLog ? <LogContent key={id} data={data as UserMessageSentData} /> : <Pre key={id} text={data.toHuman()} />;

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
