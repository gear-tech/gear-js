import React, { Dispatch, SetStateAction } from 'react';
import { Node as NodeType, NodeSection } from 'types/sidebar';
import { Node } from './Node/Node';
import styles from './Section.module.scss';

type Props = {
  section: NodeSection;
  localNodes: NodeType[];
  setLocalNodes: Dispatch<React.SetStateAction<NodeType[]>>;
  selectedNode: string;
  setSelectedNode: Dispatch<SetStateAction<string>>;
};

const Nodes = ({ section, localNodes, setLocalNodes, selectedNode, setSelectedNode }: Props) => {
  const { caption, nodes } = section;
  const concatedNodes = caption === 'development' ? [...nodes, ...localNodes] : nodes;

  const getNodes = () =>
    concatedNodes.map((node, index) => (
      <Node
        key={index}
        address={node.address}
        isCustom={node.custom}
        setLocalNodes={setLocalNodes}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />
    ));

  return (
    <li key={caption} className="nodes__item">
      <p className="nodes__item-caption">{caption}</p>
      <ul className="nodes__item-list">{getNodes()}</ul>
    </li>
  );
};

export { Nodes };
