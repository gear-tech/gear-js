import { Hex, ProgramMetadata, getProgramMetadata } from '@gear-js/api';
import { useState, useEffect } from 'react';

import { fetchCodeMetadata } from 'api';

const useMetadata = (codeId: Hex) => {
  const [metadata, setMetadata] = useState<ProgramMetadata>();

  useEffect(() => {
    fetchCodeMetadata(codeId).then(({ result }) => setMetadata(getProgramMetadata(result.hex)));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return metadata;
};

export { useMetadata };
