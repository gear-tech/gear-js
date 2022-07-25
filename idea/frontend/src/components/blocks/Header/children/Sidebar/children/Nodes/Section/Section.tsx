import { Dispatch, SetStateAction } from 'react';

import styles from './Section.module.scss';
import { Node as NodeElement } from './Node/Node';

import { Node, NodeSection } from 'types/api';

type Props = {
  section: NodeSection;
  localNodes: Node[];
  setLocalNodes: Dispatch<React.SetStateAction<Node[]>>;
  selectedNode: string;
  setSelectedNode: Dispatch<SetStateAction<string>>;
};

const Section = ({ section, localNodes, setLocalNodes, selectedNode, setSelectedNode }: Props) => {
  const { caption, nodes } = section;
  const concatedNodes = caption === 'development' ? [...nodes, ...localNodes] : nodes;

  const getNodes = () =>
    concatedNodes.map((node, index) => (
      <NodeElement
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        address={node.address}
        isCustom={node.isCustom}
        setLocalNodes={setLocalNodes}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />
    ));

  return (
    <li key={caption} className={styles.section}>
      <p className={styles.caption}>{caption}</p>
      <ul>{getNodes()}</ul>
    </li>
  );
};

export { Section };
