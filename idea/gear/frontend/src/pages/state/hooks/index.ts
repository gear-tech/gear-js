import { HexString } from '@polkadot/util/types';
import { useParams } from 'react-router-dom';

type Params = {
  programId: HexString;
};

const useProgramId = () => {
  const { programId } = useParams() as Params;

  return programId;
};

export { useProgramId };
