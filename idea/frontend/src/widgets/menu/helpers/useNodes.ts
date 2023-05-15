import { useEffect, useState, useCallback } from 'react';

import { NodeSection } from 'entities/node';
import { LocalStorage, NODE_SECTIONS } from 'shared/config';

import { concatNodes, isDevSection, getLocalNodes, getLocalNodesFromLS } from './helpers';
import { DEVELOPMENT_SECTION } from '../model/consts';

const useNodes = () => {
  const [nodeSections, setNodeSections] = useState<NodeSection[]>([]);

  const addLocalNode = useCallback(
    (address: string) => {
      const newLocalNode = { isCustom: true, address };

      const allNodes = concatNodes(nodeSections, newLocalNode);

      const devSection = allNodes.find(isDevSection);
      const localNodes = devSection ? getLocalNodes(devSection.nodes) : [newLocalNode];

      setNodeSections(allNodes);

      localStorage.setItem(LocalStorage.Nodes, JSON.stringify(localNodes));
    },
    [nodeSections],
  );

  const removeLocalNode = useCallback(
    (address: string) =>
      setNodeSections((prevState) =>
        prevState.map((section) => {
          if (isDevSection(section)) {
            const filtredNodes = section.nodes.filter((node) => node.address !== address);

            localStorage.setItem(LocalStorage.Nodes, JSON.stringify(filtredNodes.filter(({ isCustom }) => isCustom)));

            return { caption: section.caption, nodes: filtredNodes };
          }

          return section;
        }),
      ),
    [],
  );

  useEffect(() => {
    const localNodes = getLocalNodesFromLS();
    const isDevSectionExist = NODE_SECTIONS.find(isDevSection);

    const allNodes = isDevSectionExist
      ? concatNodes(NODE_SECTIONS, localNodes)
      : NODE_SECTIONS.concat({ caption: DEVELOPMENT_SECTION, nodes: localNodes });

    setNodeSections(allNodes);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { nodeSections, addLocalNode, removeLocalNode };
};

export { useNodes };
