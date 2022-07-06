import { useEffect, useState } from 'react';

import styles from './Sidebar.module.scss';
import { Nodes as NodesType, NodeSections } from '../../types';
import { Form } from './children/Form/Form';
import { Nodes } from './children/Nodes/Nodes';
import { Header } from './children/Header/Header';

import { LOCAL_STORAGE } from 'consts';
import { useOutsideClick } from 'hooks';
import { NODE_API_ADDRESS } from 'context/api/const';

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
  const [selectedNode, setSelectedNode] = useState(NODE_API_ADDRESS);
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
