import { useEffect, useState } from 'react';
import { getWasmMetadata, Metadata, ProgramId } from '@gear-js/api';
import { useApi } from 'hooks';

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

// TODO: unknown to polkadot's AnyJson
function useReadState(programId: ProgramId, metaBuffer: Buffer | undefined, inputValue?: unknown) {
  const [state, setState] = useState<unknown>();
  const { api } = useApi();

  useEffect(() => {
    if (metaBuffer)
      api.programState.read(programId, metaBuffer, inputValue).then((codecState) => setState(codecState.toHuman()));
  }, [programId, metaBuffer, inputValue, api.programState]);

  return state;
}

export { useMetadata, useReadState };
