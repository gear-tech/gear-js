import { formatDate } from 'helpers';
import { MessageModel } from 'types/message';
import { Spinner } from 'components/common/Spinner/Spinner';
import { FormText, formStyles } from 'components/common/Form';

type Props = {
  message: MessageModel;
  payload: string;
};

const MessageInfo = ({ message, payload }: Props) => {
  const { id, source, destination, timestamp } = message;

  return (
    <div className={formStyles.largeForm}>
      <FormText label="Message Id" text={id} />

      <FormText label="Source" text={source} />

      <FormText label="Destination" text={destination} />

      <FormText label="Timestamp" text={formatDate(timestamp)} />
      {/* TODO: improve loder design */}
      {payload ? <FormText label="Payload" text={payload} isTextarea /> : <Spinner />}
    </div>
  );
};

export { MessageInfo };
