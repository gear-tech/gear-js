import { Node, NodeSection } from 'entities/node';
import { LocalStorage } from 'shared/config';

import { DEVELOPMENT_SECTION } from '../model/consts';

const isDevSection = (section: NodeSection) => section.caption === DEVELOPMENT_SECTION;

const getLocalNodes = (nodes: Node[]): Node[] =>
  nodes.reduce((result, node) => {
    if (node.isCustom) result.push(node);

    return result;
  }, [] as Node[]);

const getLocalNodesFromLS = (): Node[] => {
  const nodes = localStorage.getItem(LocalStorage.Nodes);

  return nodes ? JSON.parse(nodes) : [];
};

const concatNodes = (nodeSections: NodeSection[], value: Node | Node[]) =>
  nodeSections.map((section) => {
    if (isDevSection(section)) {
      return {
        caption: section.caption,
        nodes: section.nodes.concat(value),
      };
    }

    return section;
  });

export { concatNodes, isDevSection, getLocalNodes, getLocalNodesFromLS };
