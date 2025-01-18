import { useAlert } from '@gear-js/react-hooks';
import { useEffect } from 'react';

function useErrorAlert(error: Error | null) {
  const alert = useAlert();

  useEffect(() => {
    if (!error) return;

    alert.error(error.message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
}

export { useErrorAlert };
