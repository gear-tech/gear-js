import { useEffect, useState } from 'react';
import { AnyJson, ISubmittableResult } from '@polkadot/types/types';
import { getWasmMetadata, Metadata, ProgramId } from '@gear-js/api';
import { useApi } from 'hooks';
import { useAlert } from 'react-alert';
import { EventRecord } from '@polkadot/types/interfaces';
import { useLoading } from './context';

function useMetadata(input: RequestInfo) {
  const [metadata, setMetadata] = useState<Metadata>();
  const [metaBuffer, setMetaBuffer] = useState<Buffer>();

  const getBuffer = (arrayBuffer: ArrayBuffer) => {
    const buffer = Buffer.from(arrayBuffer);

    setMetaBuffer(buffer);
    return buffer;
  };

  useEffect(() => {
    fetch(input)
      .then((response) => response.arrayBuffer())
      .then(getBuffer)
      .then((buffer) => getWasmMetadata(buffer))
      .then(setMetadata);
  }, [input]);

  return { metadata, metaBuffer };
}

type FormattedState = { [key: string]: { [key: string]: AnyJson } };

// TODO: are payload and state AnyJson? to disable useEffect deps or to memoize payload? should we handle loading on useMetadata?
function useReadState(programId: ProgramId, metaBuffer: Buffer | undefined, payload?: AnyJson) {
  const [state, setState] = useState<AnyJson>();
  const { api } = useApi();
  const { enableLoading, disableLoading } = useLoading();

  const getValues = <Value>(obj: { [key: string]: Value }) => Object.values(obj)[0];
  const getUnwrappedState = (formattedState: FormattedState) => getValues(getValues(formattedState));

  useEffect(() => {
    if (metaBuffer) {
      enableLoading();

      api.programState
        .read(programId, metaBuffer, payload)
        .then((codecState) => codecState.toHuman() as FormattedState)
        .then(getUnwrappedState)
        .then(setState)
        .finally(() => disableLoading());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaBuffer]);

  return state;
}

function useStatus() {
  const alert = useAlert();
  const { disableLoading } = useLoading();

  const handleEventsStatus = (events: EventRecord[]) => {
    events.forEach(({ event: { method } }) => {
      if (method === 'DispatchMessageEnqueued') {
        alert.success('Send message: Finalized');
        // resetValues();
      } else if (method === 'ExtrinsicFailed') {
        alert.info('Extrinsic failed');
      }
    });
  };

  const handleStatus = (result: ISubmittableResult) => {
    const { status, events } = result;
    const { isInBlock, isInvalid, isFinalized } = status;

    if (isInvalid) {
      alert.info('Transaction error. Status: isInvalid');
      disableLoading();
    } else if (isInBlock) {
      alert.success('Send message: In block');
    } else if (isFinalized) {
      handleEventsStatus(events);
      disableLoading();
    }
  };

  return handleStatus;
}

export { useMetadata, useReadState, useStatus };
