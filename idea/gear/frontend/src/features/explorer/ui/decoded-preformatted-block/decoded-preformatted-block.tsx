import { Checkbox } from '@gear-js/ui';
import { Codec } from '@polkadot/types/types';
import { isHex } from '@polkadot/util';
import { HexString } from '@polkadot/util/types';
import { useEffect, useState } from 'react';

import { useMetadata } from '@/features/metadata';
import { useProgram } from '@/features/program';
import { isNullOrUndefined } from '@/shared/helpers';
import { PreformattedBlock } from '@/shared/ui/preformattedBlock';

import { Method } from '../../consts';
import {
  FormattedUserMessageSentData,
  FormattedSendMessageData,
  FormattedSendReplyData,
  FormattedUploadProgramData,
  FormattedCreateProgramData,
} from '../../types';

import styles from './decoded-preformatted-block.module.scss';

type ProgramIdProps = { programId: HexString | undefined };

type UserMessageSentProps = { data: FormattedUserMessageSentData; method: Method.UserMessageSent };
type SendMessageProps = { data: FormattedSendMessageData; method: Method.SendMessage };
type SendReplyProps = { data: FormattedSendReplyData; method: Method.SendReply };
type UploadProgramProps = { data: FormattedUploadProgramData; method: Method.UploadProgram };
type CreateProgramProps = { data: FormattedCreateProgramData; method: Method.CreateProgram };

type Props = ProgramIdProps &
  (UserMessageSentProps | SendMessageProps | SendReplyProps | UploadProgramProps | CreateProgramProps);

const DecodedPreformattedBlock = ({ programId, data, method }: Props) => {
  const getPayload = () => {
    switch (method) {
      case Method.UserMessageSent:
        return data.message.payload;

      case Method.SendMessage:
      case Method.SendReply:
        return data.payload;

      case Method.UploadProgram:
      case Method.CreateProgram:
        return data.initPayload;

      default:
    }
  };

  const payload = getPayload();
  const isFormattedPayloadHex = isHex(payload);

  const [decodedPayload, setDecodedPayload] = useState<Codec>();
  const [isDecodedPayload, setIsDecodedPayload] = useState(false);

  const [error, setError] = useState('');
  const isError = !!error;

  const { data: program } = useProgram(isFormattedPayloadHex ? programId : undefined);
  const { metadata } = useMetadata(program?.metahash);

  const getTypes = () => {
    if (!metadata) return [];

    switch (method) {
      case Method.UserMessageSent:
        return [metadata.types.handle.output, metadata.types.init.output, metadata.types.others.output];

      case Method.SendMessage:
        return [metadata.types.handle.input, metadata.types.others.input];

      case Method.SendReply:
        return [metadata.types.reply];

      case Method.UploadProgram:
      case Method.CreateProgram:
        return [metadata.types.init.input];

      default:
        return [];
    }
  };

  const decodeType = (type: number | null, isLastFallback: boolean) => {
    if (!metadata) return;

    try {
      if (isNullOrUndefined(type)) throw new Error();

      setDecodedPayload(metadata.createType(type, payload));

      return true;
    } catch {
      if (isLastFallback) setError("Can't decode payload");

      return false;
    }
  };

  useEffect(() => {
    if (!metadata) return;

    const types = getTypes();
    const lastTypeIndex = types.length - 1;

    types.some((type, index) => decodeType(type, index === lastTypeIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  const handleCheckboxChange = () => setIsDecodedPayload((prevValue) => !prevValue);

  const getDecodedPayloadData = () => {
    const formattedDecodedPayload = decodedPayload?.toHuman() || '';

    switch (method) {
      case Method.UserMessageSent:
        return { ...data, message: { ...data.message, payload: formattedDecodedPayload } };

      case Method.SendMessage:
      case Method.SendReply:
        return { ...data, payload: formattedDecodedPayload };

      case Method.UploadProgram:
      case Method.CreateProgram:
        return { ...data, initPayload: formattedDecodedPayload };

      default:
    }
  };

  return (
    <>
      {isFormattedPayloadHex && (
        <div className={styles.checkbox}>
          <Checkbox
            label="Decoded payload"
            checked={isDecodedPayload}
            onChange={handleCheckboxChange}
            disabled={isError}
          />

          {isError && <p className={styles.error}>{error}</p>}
        </div>
      )}

      <PreformattedBlock text={isDecodedPayload ? getDecodedPayloadData() : data} />
    </>
  );
};

export { DecodedPreformattedBlock };
