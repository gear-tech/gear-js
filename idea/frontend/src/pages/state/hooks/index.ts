import { getProgramMetadata, ProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { fetchMetadata, getLocalProgramMeta } from 'api';
import { useChain } from 'hooks';

type Params = {
  programId: HexString;
};

const useProgramId = () => {
  const { programId } = useParams() as Params;

  return programId;
};

const useStateType = () => {
  const location = useLocation();

  const [, , type] = location.pathname.split('/');
  const isFull = type === 'full';
  const isWasm = type === 'wasm';
  const isSelection = !isFull && !isWasm;

  return { stateType: type, isFullState: isFull, isWasmState: isWasm, isStateTypeSelection: isSelection };
};

const useMetadata = (hash: HexString) => {
  const alert = useAlert();
  const { isDevChain } = useChain();

  const [metadata, setMetadata] = useState<ProgramMetadata>();

  useEffect(() => {
    // TODO: local meta
    // const getMetadata = isDevChain ? getLocalProgramMeta : fetchMetadata;

    fetchMetadata({ hash })
      .then(({ result }) => setMetadata(getProgramMetadata(result.hex)))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return metadata;
};

export { useProgramId, useStateType, useMetadata };
