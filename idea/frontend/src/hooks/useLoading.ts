import { useState } from 'react';

function useLoading() {
  const [isLoading, setIsLoading] = useState(false);

  const enableLoading = () => setIsLoading(true);
  const disableLoading = () => setIsLoading(false);

  return [isLoading, enableLoading, disableLoading] as const;
}

export { useLoading };
