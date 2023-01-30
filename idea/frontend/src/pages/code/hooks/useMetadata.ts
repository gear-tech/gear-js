import { Hex, ProgramMetadata, getProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { useState, useEffect } from 'react';

import { fetchCodeMetadata } from 'api';

const useMetadata = (codeId: Hex) => {
  const alert = useAlert();

  const [metadata, setMetadata] = useState<ProgramMetadata>();

  useEffect(() => {
    fetchCodeMetadata(codeId)
      .then(({ result }) => setMetadata(getProgramMetadata(result.hex)))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return metadata;
};

export { useMetadata };
