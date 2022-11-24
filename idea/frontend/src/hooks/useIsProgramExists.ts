import { Hex } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { useState } from 'react';

function useIsProgramExists(programId: Hex) {
  const { api } = useApi();

  const [isReady, setIsReady] = useState(true);

  const enableLoading = () => setIsReady(false);
  const disableLoading = () => setIsReady(true);

  const isProgramExists = () => {
    enableLoading();

    return api.program.exists(programId).finally(disableLoading);
  };

  return { isProgramExists, isProgramExistenceReady: isReady };
}

export { useIsProgramExists };
