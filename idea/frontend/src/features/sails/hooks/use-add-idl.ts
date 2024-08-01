import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';

import { getErrorMessage } from '@/shared/helpers';

import { addIdl } from '../api';

function useAddIdl() {
  const alert = useAlert();

  return (codeId: HexString, data: string) =>
    addIdl(codeId, data).catch((error) => alert.error(getErrorMessage(error)));
}

export { useAddIdl };
