import { useAlert } from '@gear-js/react-hooks';
import { HexString } from '@gear-js/api';

import { addCodeName } from '@/api';

import { useChain } from './context';

function useAddCodeName() {
  const { isDevChain } = useChain();
  const alert = useAlert();

  return (id: HexString, name: string) =>
    isDevChain ? Promise.resolve() : addCodeName(id, name).catch((error) => alert.error(error));
}

export { useAddCodeName };
