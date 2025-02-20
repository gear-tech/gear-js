import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';

import { setCodeMeta } from '@/features/code';
import { addLocalProgramName } from '@/features/local-indexer';
import { setProgramMeta } from '@/features/program';
import { getErrorMessage } from '@/shared/helpers';

import { useChain } from './context';

type Params = Omit<Parameters<typeof setProgramMeta>[0], 'metaType'> & {
  codeId: HexString;
  metaHex?: HexString;
  idl?: string;
};

function useAddProgramName() {
  const { isDevChain } = useChain();
  const alert = useAlert();

  return async ({ metaHex, idl, codeId, ...parameters }: Params) => {
    let metaType: 'meta' | 'sails' | undefined;
    if (metaHex) metaType = 'meta';
    if (idl) metaType = 'sails';

    return (
      isDevChain
        ? addLocalProgramName(parameters.id, parameters.name || parameters.id)
        : // maybe setCodeMeta should be handled implicitly at the backend?
          Promise.all([setCodeMeta({ id: codeId, metaType }), setProgramMeta({ ...parameters, metaType })])
    ).catch((error) => alert.error(getErrorMessage(error)));
  };
}

export { useAddProgramName };
