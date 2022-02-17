import React, { Dispatch, SetStateAction } from 'react';
import { Node, NodeSection } from 'types/sidebar';
import { Section } from './Section/Section';
import styles from './Nodes.module.scss';

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
