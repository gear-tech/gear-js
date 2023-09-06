import { PreformattedBlock } from 'shared/ui/preformattedBlock';

import { FormattedUserMessageSentData } from '../../types';
import { IdeaEvent } from '../../idea-event';
import { Method } from '../../consts';
import { ExpansionPanel } from '../expansion-panel';
import { DecodedLogBlock } from '../decoded-log-block';

type Props = {
  value: IdeaEvent | IdeaEvent[];
};

// TODO: combine w/ ../event

const BlockEvent = ({ value }: Props) => {
  const isGroup = Array.isArray(value);

  const event = isGroup ? value[0] : value;
  const { method, heading, description } = event;

  const isLog = method === Method.UserMessageSent;

  const getContent = ({ id, data }: IdeaEvent = event) => {
    const formattedData = data.toHuman();

    return isLog ? (
      <DecodedLogBlock key={id} data={formattedData as FormattedUserMessageSentData} />
    ) : (
      <PreformattedBlock key={id} text={formattedData} />
    );
  };

  const getBody = () => (isGroup ? value.map(getContent) : getContent());

  return (
    <ExpansionPanel heading={heading} subheading={description}>
      {getBody()}
    </ExpansionPanel>
  );
};

export { BlockEvent };
