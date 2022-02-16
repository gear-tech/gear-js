import { useEffect, useState } from 'react';
import { DEFAULT_NODES_URL } from 'consts';
import { NodeSection } from 'types/sidebar';

function useSidebarNodes() {
  const [nodeSections, setNodeSections] = useState<NodeSection[]>([]);

  useEffect(() => {
    fetch(DEFAULT_NODES_URL)
      .then((result) => result.json())
      .then(setNodeSections);
  }, []);

  return nodeSections;
}

export { useSidebarNodes };
