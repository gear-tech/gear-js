import { memo } from 'react';
import { NodeSection } from 'entities/node';

import styles from './Section.module.scss';
import { Node as NodeItem } from '../node';

type Props = {
  section: NodeSection;
  nodeAddress: string;
  selectedNode: string;
  selectNode: (address: string) => void;
  removeLocalNode: (address: string) => void;
};

const Section = memo((props: Props) => {
  const { section, nodeAddress, selectedNode, selectNode, removeLocalNode } = props;

  const getNodes = () =>
    section.nodes.map((node, index) => (
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
      <h2 className={styles.caption}>{section.caption}</h2>
      <ul className={styles.sectionList}>{getNodes()}</ul>
    </li>
  );
});

export { Section };
