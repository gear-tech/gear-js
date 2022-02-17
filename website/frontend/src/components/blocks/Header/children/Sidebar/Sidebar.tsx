import React, { useEffect, useState } from 'react';
import { nodeApi } from 'api/initApi';
import { Node, NodeSection } from 'types/sidebar';
import { Header } from './children/Header/Header';
import { Form } from './children/Form/Form';
import styles from './Sidebar.module.scss';
import { Nodes } from './children/Nodes/Nodes';

type Props = {
  closeSidebar: () => void;
  nodeSections: NodeSection[];
};

const Sidebar = ({ closeSidebar, nodeSections }: Props) => {
  const getLocalNodes = (): Node[] => {
    const nodes = localStorage.getItem('nodes');
    return nodes ? JSON.parse(nodes) : [];
  };

  const [localNodes, setLocalNodes] = useState<Node[]>(getLocalNodes());
  const [selectedNode, setSelectedNode] = useState(nodeApi.address);

  useEffect(() => {
    localStorage.setItem('nodes', JSON.stringify(localNodes));
  }, [localNodes]);

  return (
    <div className={styles.sidebar}>
      <Header closeSidebar={closeSidebar} selectedNode={selectedNode} />
      <Nodes
        nodeSections={nodeSections}
        localNodes={localNodes}
        setLocalNodes={setLocalNodes}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />
      <Form nodeSections={nodeSections} localNodes={localNodes} setLocalNodes={setLocalNodes} />
    </div>
  );
};

export { Sidebar };
