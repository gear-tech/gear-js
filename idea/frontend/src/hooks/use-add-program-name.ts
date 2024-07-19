import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';

import { setProgramMeta } from '@/features/program';
import { addLocalProgramName } from '@/features/local-indexer';
import { getErrorMessage } from '@/shared/helpers';

import { useChain } from './context';

type Params = Omit<Parameters<typeof setProgramMeta>[0], 'metaType'> & { metaHex?: HexString; idl?: string };

function useAddProgramName() {
  const { isDevChain } = useChain();
  const alert = useAlert();

  return async ({ metaHex, idl, ...parameters }: Params) => {
    let metaType: 'meta' | 'sails' | undefined;
    if (metaHex) metaType = 'meta';
    if (idl) metaType = 'sails';

    return (
      isDevChain
        ? addLocalProgramName(parameters.id, parameters.name || parameters.id)
        : setProgramMeta({ ...parameters, metaType })
    ).catch((error) => alert.error(getErrorMessage(error)));
  };
}

export { useAddProgramName };
