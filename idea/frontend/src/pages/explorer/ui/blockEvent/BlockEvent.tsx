import { UserMessageSentData } from '@gear-js/api';

import { IdeaEvent, Method } from 'entities/explorer';
import { PreformattedBlock } from 'shared/ui/preformattedBlock';

import { ExpansionPanel } from '../expansionPanel';
import { Log } from '../log';

type Props = {
  value: IdeaEvent | IdeaEvent[];
};

// TODO: combine w/ ../event

const BlockEvent = ({ value }: Props) => {
  const isGroup = Array.isArray(value);

  const event = isGroup ? value[0] : value;
  const { method, heading, description } = event;

  const isLog = method === Method.UserMessageSent;

  const getContent = ({ id, data }: IdeaEvent = event) =>
    isLog ? <Log key={id} data={data as UserMessageSentData} /> : <PreformattedBlock key={id} text={data.toHuman()} />;

  const getBody = () => (isGroup ? value.map(getContent) : getContent());

  return (
    <ExpansionPanel heading={heading} subheading={description}>
      {getBody()}
    </ExpansionPanel>
  );
};

export { BlockEvent };
