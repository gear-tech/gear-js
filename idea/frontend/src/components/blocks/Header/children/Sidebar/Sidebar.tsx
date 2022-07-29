import { useEffect, useState } from 'react';

import styles from './Sidebar.module.scss';
import { Form } from './children/Form/Form';
import { Nodes } from './children/Nodes/Nodes';
import { Header } from './children/Header/Header';

import { LOCAL_STORAGE } from 'consts';
import { useOutsideClick } from 'hooks';
import { NODE_API_ADDRESS } from 'context/api/const';
import { Node, NodeSection } from 'types/api';

type Props = {
  closeSidebar: () => void;
  nodeSections: NodeSection[];
};

const Sidebar = ({ closeSidebar, nodeSections }: Props) => {
  const getLocalNodes = (): Node[] => {
    const nodes = localStorage.getItem(LOCAL_STORAGE.NODES);
    return nodes ? JSON.parse(nodes) : [];
  };

  const [localNodes, setLocalNodes] = useState<Node[]>(getLocalNodes());
  const [selectedNode, setSelectedNode] = useState(NODE_API_ADDRESS);
  const ref = useOutsideClick<HTMLDivElement>(closeSidebar);

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
