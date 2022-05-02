import React, { useEffect, useState } from 'react';
import { nodeApi } from 'api/initApi';
import { useOutsideClick } from 'hooks';
import { LOCAL_STORAGE } from 'consts';
import { Nodes as NodesType, NodeSections } from '../../types';
import { Header } from './children/Header/Header';
import { Nodes } from './children/Nodes/Nodes';
import { Form } from './children/Form/Form';
import styles from './Sidebar.module.scss';

type Props = {
  closeSidebar: () => void;
  nodeSections: NodeSections;
};

const Sidebar = ({ closeSidebar, nodeSections }: Props) => {
  const getLocalNodes = (): NodesType => {
    const nodes = localStorage.getItem(LOCAL_STORAGE.NODES);
    return nodes ? JSON.parse(nodes) : [];
  };

  const [localNodes, setLocalNodes] = useState<NodesType>(getLocalNodes());
  const [selectedNode, setSelectedNode] = useState(nodeApi.address);
  const ref = useOutsideClick(closeSidebar);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE.NODES, JSON.stringify(localNodes));
  }, [localNodes]);

  return (
    <div className={styles.sidebar} ref={ref} data-testid="sidebar">
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
