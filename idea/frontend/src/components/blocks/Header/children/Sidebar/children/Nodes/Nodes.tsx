import { Dispatch, SetStateAction } from 'react';

import styles from './Nodes.module.scss';
import { Section } from './Section/Section';

import { Node, NodeSection } from 'types/api';

type Props = {
  nodeSections: NodeSection[];
  localNodes: Node[];
  setLocalNodes: Dispatch<SetStateAction<Node[]>>;
  selectedNode: string;
  setSelectedNode: Dispatch<SetStateAction<string>>;
};

const Nodes = ({ nodeSections, localNodes, setLocalNodes, selectedNode, setSelectedNode }: Props) => {
  const getSections = () =>
    nodeSections.map((section, index) => (
      <Section
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        section={section}
        localNodes={localNodes}
        setLocalNodes={setLocalNodes}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />
    ));

  return <ul className={styles.nodes}>{getSections()}</ul>;
};

export { Nodes };
