import { useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

function useNodeVersion() {
  const { api, isApiReady } = useApi();

  const [nodeVersion, setNodeVersion] = useState('');
  const [commitHash, setCommitHash] = useState('');

  useEffect(() => {
    setNodeVersion('');
    setCommitHash('');

    if (!isApiReady) return;

    api.nodeVersion().then((result) => {
      const [, commitHashResult] = result.split('-');

      setNodeVersion(result);
      setCommitHash(commitHashResult);
    });
     
  }, [isApiReady]);

  return { nodeVersion, commitHash };
}

export { useNodeVersion };
