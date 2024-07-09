import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';

import { addProgramName } from '@/api';
import { addLocalProgramName } from '@/features/local-indexer';

import { useChain } from './context';
import { getErrorMessage } from '@/shared/helpers';

function useAddProgramName() {
  const { isDevChain } = useChain();
  const alert = useAlert();

  return (id: HexString, name: string) =>
    (isDevChain ? addLocalProgramName : addProgramName)(id, name).catch((error) => alert.error(getErrorMessage(error)));
}

export { useAddProgramName };
