import { memo } from 'react';
import { Node, NodeSection } from 'entities/node';

import styles from './Section.module.scss';
import { Node as NodeItem } from '../node';

type Props = {
  section: NodeSection;
  localNodes: Node[];
  nodeAddress: string;
  selectedNode: string;
  selectNode: (address: string) => void;
  removeLocalNode: (address: string) => void;
};

const Section = memo((props: Props) => {
  const { section, localNodes, nodeAddress, selectedNode, selectNode, removeLocalNode } = props;
  const { caption, nodes } = section;

  const concatedNodes = caption === 'development' ? [...nodes, ...localNodes] : nodes;

  const getNodes = () =>
    concatedNodes.map((node, index) => (
      <NodeItem
        // eslint-disable-next-line react/no-array-index-key
        key={`${node.address}-${index}`}
        address={node.address}
        isCustom={node.isCustom}
        nodeAddress={nodeAddress}
        selectedNode={selectedNode}
        selectNode={selectNode}
        removeLocalNode={removeLocalNode}
      />
    ));

  return (
    <li>
      <h2 className={styles.caption}>{caption}</h2>
      <ul className={styles.sectionList}>{getNodes()}</ul>
    </li>
  );
});

export { Section };
