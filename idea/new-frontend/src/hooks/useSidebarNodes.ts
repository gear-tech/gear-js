import { useEffect, useState } from 'react';
import { useAlert } from '@gear-js/react-hooks';

import { DEFAULT_NODES_URL } from 'shared/config';
import { GetDefaultNodesResponse } from 'shared/types/api';

const useSidebarNodes = () => {
  const alert = useAlert();

  const [nodeSections, setNodeSections] = useState<GetDefaultNodesResponse>([]);

  useEffect(() => {
    fetch(DEFAULT_NODES_URL)
      .then((result) => result.json())
      .then(setNodeSections)
      .catch((error) => alert.error(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return nodeSections;
};

export { useSidebarNodes };
