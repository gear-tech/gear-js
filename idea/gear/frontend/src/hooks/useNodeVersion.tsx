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

    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- TODO(#1800): resolve eslint comments
    api.nodeVersion().then((result) => {
      const [, commitHashResult] = result.split('-');

      setNodeVersion(result);
      setCommitHash(commitHashResult);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady]);

  return { nodeVersion, commitHash };
}

export { useNodeVersion };
