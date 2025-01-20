import { useApi } from '@gear-js/react-hooks';
import { HexString, GearCoreProgram } from '@gear-js/api';
import { Option } from '@polkadot/types';

import { ProgramStatus } from '../consts';

const useProgramStatus = () => {
  const { api, isApiReady } = useApi();

  const getProgramStatus = async (id: HexString) => {
    if (!isApiReady) return Promise.reject(new Error('API is not initialized'));

    const option = await api.query.gearProgram.programStorage<Option<GearCoreProgram>>(id);
    const { isTerminated, isExited } = option.unwrap();

    if (isTerminated) return ProgramStatus.Terminated;
    if (isExited) return ProgramStatus.Exited;

    return ProgramStatus.Active;
  };

  return { getProgramStatus };
};

export { useProgramStatus };
