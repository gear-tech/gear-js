import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';

import { addProgramName } from '@/api';
import { addLocalProgramName } from '@/features/local-indexer';
import { getErrorMessage } from '@/shared/helpers';

import { useChain } from './context';

function useAddProgramName() {
  const { isDevChain } = useChain();
  const alert = useAlert();

  return (id: HexString, name: string) =>
    // timeout is gonna be removed in the upcoming indexer update, delay is needed for block data to be indexed
    setTimeout(() => {
      (isDevChain ? addLocalProgramName : addProgramName)(id, name).catch((error) =>
        alert.error(getErrorMessage(error)),
      );
    }, 2000);
}

export { useAddProgramName };
