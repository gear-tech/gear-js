import { Extrinsic as DotExtrinsic } from '@polkadot/types/interfaces';
import { AnyJson } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';

import { PreformattedBlock } from '@/shared/ui/preformattedBlock';

import { Method } from '../../consts';
import {
  FormattedSendReplyData,
  FormattedSendMessageData,
  FormattedUploadProgramData,
  FormattedCreateProgramData,
} from '../../types';
import { DecodedPreformattedBlock } from '../decoded-preformatted-block';
import { ExpansionPanel } from '../expansion-panel';

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

    dataObject[formattedName] = formattedValue;

    return dataObject;
  }, {});

  const getBody = () => {
    switch (method) {
      case Method.SendMessage:
        return (
          <DecodedPreformattedBlock
            programId={programId}
            data={data as FormattedSendMessageData}
            method={Method.SendMessage}
          />
        );

      case Method.SendReply:
        return (
          <DecodedPreformattedBlock
            programId={programId}
            data={data as FormattedSendReplyData}
            method={Method.SendReply}
          />
        );

      case Method.UploadProgram:
        return (
          <DecodedPreformattedBlock
            programId={programId}
            data={data as FormattedUploadProgramData}
            method={Method.UploadProgram}
          />
        );

      case Method.CreateProgram:
        return (
          <DecodedPreformattedBlock
            programId={programId}
            data={data as FormattedCreateProgramData}
            method={Method.CreateProgram}
          />
        );

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
