import { Dispatch, SetStateAction } from 'react';
import { Nodes, NodeSection } from '../../../../../types';
import { Node } from './Node/Node';
import styles from './Section.module.scss';

type Props = {
  section: NodeSection;
  localNodes: Nodes;
  setLocalNodes: Dispatch<React.SetStateAction<Nodes>>;
  selectedNode: string;
  setSelectedNode: Dispatch<SetStateAction<string>>;
};

const Section = ({ section, localNodes, setLocalNodes, selectedNode, setSelectedNode }: Props) => {
  const { caption, nodes } = section;
  const concatedNodes = caption === 'development' ? [...nodes, ...localNodes] : nodes;

  const getNodes = () =>
    concatedNodes.map((node, index) => (
      <Node
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
