import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';

import { setCodeMeta } from '@/features/code';

import { useChain } from './context';

type Params = Omit<Parameters<typeof setCodeMeta>[0], 'metaType'> & { metaHex?: HexString; idl?: string };

function useAddCodeName() {
  const { isDevChain } = useChain();
  const alert = useAlert();

  return ({ metaHex, idl, ...parameters }: Params) => {
    let metaType: 'meta' | 'sails' | undefined;
    if (metaHex) metaType = 'meta';
    if (idl) metaType = 'sails';

    return isDevChain
      ? Promise.resolve()
      : setCodeMeta({ ...parameters, metaType }).catch((error) => alert.error(error));
  };
}

export { useAddCodeName };
