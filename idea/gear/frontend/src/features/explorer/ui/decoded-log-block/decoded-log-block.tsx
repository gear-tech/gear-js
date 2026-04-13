import { Method } from '../../consts';
import type { FormattedUserMessageSentData } from '../../types';
import { DecodedPreformattedBlock } from '../decoded-preformatted-block';

type Props = {
  data: FormattedUserMessageSentData;
};

const DecodedLogBlock = ({ data }: Props) => (
  <DecodedPreformattedBlock programId={data.message.source} data={data} method={Method.UserMessageSent} />
);

export { DecodedLogBlock };
