import { PreformattedBlock } from '@/shared/ui/preformattedBlock';

import { Method } from '../../consts';
import { IdeaEvent } from '../../idea-event';
import { FormattedUserMessageSentData } from '../../types';
import { DecodedLogBlock } from '../decoded-log-block';
import { ExpansionPanel } from '../expansion-panel';

type Props = {
  value: IdeaEvent | IdeaEvent[];
};

// TODO: combine w/ ../event

const BlockEvent = ({ value }: Props) => {
  const isGroup = Array.isArray(value);

  const event = isGroup ? value[0] : value;
  const { method, heading, description } = event;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison -- TODO(#1800): resolve eslint comments
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
