import { useState } from 'react';

function useLoading() {
  const [isLoading, setIsLoading] = useState(true);

  const withLoading = async <T>(request: Promise<T>) => {
    setIsLoading(true);

    return request.finally(() => setIsLoading(false));
  };

  return [isLoading, setIsLoading, withLoading] as const;
}

export { useLoading };
