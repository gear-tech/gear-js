import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';

import { addMetadata as addStorageMetadata } from '@/api';
import { addLocalMetadata } from '@/features/local-indexer';
import { getErrorMessage } from '@/shared/helpers';

import { useChain } from './context';

const useAddMetadata = () => {
  const alert = useAlert();
  const { isDevChain } = useChain();

  return (hash: HexString, hex: HexString) =>
    (isDevChain ? addLocalMetadata : addStorageMetadata)(hash, hex)
      .then(() => alert.success('Metadata saved successfully'))
      .catch((error) => alert.error(getErrorMessage(error)));
};

export { useAddMetadata };
