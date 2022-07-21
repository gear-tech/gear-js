import { useEffect, useState } from 'react';

import { DEFAULT_NODES_URL } from 'consts';
import { NodeSection } from 'types/api';

function useSidebarNodes() {
  const [nodeSections, setNodeSections] = useState<NodeSection[]>([]);

  useEffect(() => {
    fetch(DEFAULT_NODES_URL)
      .then((result) => result.json())
      .then(setNodeSections)
      .catch(console.error);
  }, []);

  return nodeSections;
}

export { useSidebarNodes };
