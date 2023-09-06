import { Checkbox } from '@gear-js/ui';
import { Codec, AnyJson } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { isHex } from '@polkadot/util';
import { useEffect, useState } from 'react';

import { PreformattedBlock } from 'shared/ui/preformattedBlock';
import { useMetadata } from 'features/metadata';
import { useProgram } from 'hooks';
import { isNullOrUndefined } from 'shared/helpers';

import { Method } from '../../consts';
import styles from './decoded-preformatted-block.module.scss';

type Props = {
  programId: HexString | undefined;
  data: { [key: string]: AnyJson };
  method: Method;
};

const DecodedPreformattedBlock = ({ programId, data, method }: Props) => {
  const getPayload = () => {
    switch (method) {
      case Method.UserMessageSent:
        // @ts-ignore
        return data.message.payload;

      case Method.SendMessage:
      case Method.SendReply:
        // @ts-ignore
        return data.payload;

      case Method.UploadProgram:
      case Method.CreateProgram:
        // @ts-ignorex
        return data.initPayload;

      default:
    }
  };

  const payload = getPayload();
  const isFormattedPayloadHex = isHex(payload);

  const [error, setError] = useState('');
  const isError = !!error;

  const [decodedPayload, setDecodedPayload] = useState<Codec>();
  const [isDecodedPayload, setIsDecodedPayload] = useState(false);

  const { program } = useProgram(isFormattedPayloadHex ? programId : undefined);
  const { metadata } = useMetadata(program?.metahash);

  const getType = () => {
    if (!metadata) return;

    switch (method) {
      case Method.UserMessageSent:
        return metadata.types.handle.output;

      case Method.SendMessage:
        return metadata.types.handle.input;

      case Method.SendReply:
        return metadata.types.reply;

      case Method.UploadProgram:
      case Method.CreateProgram:
        return metadata.types.init.input;

      default:
    }
  };

  const getFallbackType = () => {
    if (!metadata) return;

    switch (method) {
      case Method.UserMessageSent:
        return metadata.types.init.output;

      case Method.SendMessage:
        return metadata.types.others.input;

      default:
    }
  };

  const decodePayload = (type: number | null | undefined, errorCallback: () => void) => {
    if (!metadata) return;

    if (isNullOrUndefined(type)) return errorCallback();

    try {
      setDecodedPayload(metadata.createType(type, payload));
    } catch {
      errorCallback();
    }
  };

  const fallbackPayloadDecode = () => decodePayload(getFallbackType(), () => setError("Can't decode payload"));

  useEffect(() => {
    if (!metadata) return;

    decodePayload(getType(), fallbackPayloadDecode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  const handleCheckboxChange = () => setIsDecodedPayload((prevValue) => !prevValue);

  const getDecodedPayloadData = () => {
    const formattedDecodedPayload = decodedPayload?.toHuman() || '';

    switch (method) {
      case Method.UserMessageSent:
        return {
          ...data,

          // @ts-ignore
          message: { ...data.message, payload: formattedDecodedPayload },
        };

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
