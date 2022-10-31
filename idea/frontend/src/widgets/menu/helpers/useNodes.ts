import { useEffect, useState, useCallback } from 'react';
import { useAlert } from '@gear-js/react-hooks';

import { getNodes } from 'api';
import { NodeSection } from 'entities/node';
import { LocalStorage } from 'shared/config';

import { concatNodes, isDevSection, getLocalNodes, getLocalNodesFromLS } from './helpers';
import { DEVELOPMENT_SECTION } from '../model/consts';

const useNodes = () => {
  const alert = useAlert();

  const [isNodesLoading, setIsNodesLoading] = useState(true);
  const [nodeSections, setNodeSections] = useState<NodeSection[]>([]);

  const setAllNodeSections = (sections: NodeSection[]) => {
    const localNodes = getLocalNodesFromLS();

    const isDevSectionExist = sections.find(isDevSection);

    const allNodes = isDevSectionExist
      ? concatNodes(sections, localNodes)
      : sections.concat({ caption: DEVELOPMENT_SECTION, nodes: localNodes });

    setNodeSections(allNodes);
  };

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
    getNodes()
      .then(setAllNodeSections)
      .catch((error) => alert.error(error.message))
      .finally(() => setIsNodesLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isNodesLoading, nodeSections, addLocalNode, removeLocalNode };
};

export { useNodes };
