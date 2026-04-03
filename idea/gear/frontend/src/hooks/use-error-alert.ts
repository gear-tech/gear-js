import { useAlert } from '@gear-js/react-hooks';
import { useEffect } from 'react';

function useErrorAlert(error: Error | null) {
  const alert = useAlert();

  useEffect(() => {
    if (!error) return;

    alert.error(error.message);
  }, [error]);
}

export { useErrorAlert };
