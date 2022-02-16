import { useEffect, useState } from 'react';
import { DEFAULT_NODES_URL } from 'consts';
import { getLastItem } from 'helpers';
import { Node, NodeSection } from 'types/sidebar';

function useSidebarNodes() {
  const [nodeSections, setNodeSections] = useState<NodeSection[]>([]);

  const getLocalNodes = (): Node[] => {
    const nodes = localStorage.getItem('nodes');
    return nodes ? JSON.parse(nodes) : [];
  };

  const concatWithLocalNodes = (sections: NodeSection[]) => {
    const devSection = getLastItem(sections) as NodeSection;
    devSection.nodes.push(...getLocalNodes());
  };

  useEffect(() => {
    fetch(DEFAULT_NODES_URL)
      .then((result) => result.json())
      .then((sections: NodeSection[]) => {
        concatWithLocalNodes(sections);
        setNodeSections(sections);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return nodeSections;
}

export { useSidebarNodes };
