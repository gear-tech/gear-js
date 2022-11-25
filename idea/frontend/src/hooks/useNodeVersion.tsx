import { useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

function useNodeVersion() {
  const { api } = useApi();
  const [nodeVersion, setNodeVersion] = useState('');

  useEffect(() => {
    api?.nodeVersion().then((result) => {
      const [, version] = result.split('-');

      if (version && version !== 'unknown') setNodeVersion(version);
    });
  }, [api]);

  return nodeVersion;
}

export { useNodeVersion };
