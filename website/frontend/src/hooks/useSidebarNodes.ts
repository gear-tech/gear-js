import { useEffect, useState } from 'react';

import { DEFAULT_NODES_URL } from 'consts';
import { GetDefaultNodesResponse } from 'types/api';

const useSidebarNodes = () => {
  const [nodeSections, setNodeSections] = useState<GetDefaultNodesResponse>([]);

  useEffect(() => {
    fetch(DEFAULT_NODES_URL)
      .then((result) => result.json())
      .then(setNodeSections)
      .catch(console.error);
  }, []);

  return nodeSections;
};

export { useSidebarNodes };
