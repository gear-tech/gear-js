import { useEffect, useState } from 'react';
import { DEFAULT_NODES_URL } from 'consts';
import { NodeSections } from './types';

function useSidebarNodes() {
  const [nodeSections, setNodeSections] = useState<NodeSections>([]);

  useEffect(() => {
    fetch(DEFAULT_NODES_URL)
      .then((result) => result.json())
      .then(setNodeSections);
  }, []);

  return nodeSections;
}

export { useSidebarNodes };
