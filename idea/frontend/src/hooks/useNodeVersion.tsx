import { useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

function useNodeVersion() {
  const { api } = useApi();

  const [nodeVersion, setNodeVersion] = useState('');
  const [commitHash, setCommitHash] = useState('');

  useEffect(() => {
    api?.nodeVersion().then((result) => {
      const [, commitHashResult] = result.split('-');

      setNodeVersion(result);
      setCommitHash(commitHashResult);
    });
  }, [api]);

  return { nodeVersion, commitHash };
}

export { useNodeVersion };
