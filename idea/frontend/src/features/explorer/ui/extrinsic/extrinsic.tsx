import { Extrinsic as DotExtrinsic } from '@polkadot/types/interfaces';
import { AnyJson } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';

import { PreformattedBlock } from 'shared/ui/preformattedBlock';

import { FormattedReplyMessageData, FormattedSendMessageData, FormattedUploadProgramMessage } from '../../types';
import { Method } from '../../consts';
import { ExpansionPanel } from '../expansion-panel';
import { SendMessageBody } from '../send-message-body/send-message-body';
import { ReplyMessageBody } from '../reply-message-body';
import { UploadProgramBody } from '../upload-program-body';

type Props = {
  extrinsic: DotExtrinsic;
  programId: HexString | undefined;
};

const Extrinsic = ({ extrinsic, programId }: Props) => {
  const { method, section, meta, args } = extrinsic.method;
  const { docs, args: metaArgs } = meta;

  const heading = `${section}.${method}`;
  const description = docs[0].toHuman();

  const data = metaArgs.reduce((dataObject: { [name: string]: AnyJson }, metaArg, index) => {
    const { name } = metaArg;
    const formattedName = name.toHuman();
    const formattedValue = args[index].toHuman();

    // eslint-disable-next-line no-param-reassign
    dataObject[formattedName] = formattedValue;

    return dataObject;
  }, {});

  const getBody = () => {
    switch (method) {
      case Method.SendMessage:
        return <SendMessageBody data={data as FormattedSendMessageData} />;

      case Method.SendReply:
        return <ReplyMessageBody data={data as FormattedReplyMessageData} />;

      case Method.UploadProgram:
        return <UploadProgramBody data={data as FormattedUploadProgramMessage} programId={programId} />;

      default:
        return <PreformattedBlock text={data} />;
    }
  };

  return (
    <ExpansionPanel heading={heading} subheading={description}>
      {getBody()}
    </ExpansionPanel>
  );
};

export { Extrinsic };
