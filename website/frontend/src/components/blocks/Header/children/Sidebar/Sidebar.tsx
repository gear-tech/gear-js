import React, { ChangeEvent, useEffect, useState } from 'react';
import cross from 'assets/images/close.svg';
import refresh from 'assets/images/refresh2.svg';
import { nodeApi } from 'api/initApi';
import { useHistory, useLocation } from 'react-router-dom';
import { NODE_ADRESS_URL_PARAM, LOCAL_STORAGE } from 'consts';
import { isNodeAddressValid } from 'helpers';
import { Node as NodeType, NodeSection } from 'types/sidebar';
import { Section } from './Section/Section';
import { Node } from './Node/Node';
import './Sidebar.scss';

type Props = {
  closeSidebar: () => void;
  nodeSections: NodeSection[];
};

const Sidebar = ({ closeSidebar, nodeSections }: Props) => {
  const { search } = useLocation();
  const history = useHistory();

  const getLocalNodes = (): NodeType[] => {
    const nodes = localStorage.getItem('nodes');
    return nodes ? JSON.parse(nodes) : [];
  };

  const [localNodes, setLocalNodes] = useState<NodeType[]>(getLocalNodes());

  const isNodeExist = (address: string) => {
    const nodes = nodeSections.flatMap((section) => section.nodes);
    const concatedNodes = [...nodes, ...localNodes];
    return concatedNodes.some((node) => node.address === address);
  };

  const [selectedNode, setSelectedNode] = useState(nodeApi.address);
  const [nodeAddress, setNodeAddress] = useState(isNodeExist(nodeApi.address) ? '' : nodeApi.address);

  useEffect(() => {
    localStorage.setItem('nodes', JSON.stringify(localNodes));
  }, [localNodes]);

  const getNodes = (nodes: NodeType[]) =>
    nodes.map((node, index) => (
      <Node
        key={index}
        address={node.address}
        isCustom={node.custom}
        setLocalNodes={setLocalNodes}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />
    ));

  const getNodeSections = () =>
    nodeSections.map((section, index) => {
      const { caption, nodes } = section;
      const concatedNodes = caption === 'development' ? [...nodes, ...localNodes] : nodes;

      return (
        <Section key={index} caption={caption}>
          {getNodes(concatedNodes)}
        </Section>
      );
    });

  const handleNodeAddressChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setNodeAddress(value);
  };

  const addNode = () => {
    if (!isNodeExist(nodeAddress)) {
      const node = { address: nodeAddress, custom: true };
      setLocalNodes((prevNodes) => [...prevNodes, node]);
      setNodeAddress('');
    }
  };

  const removeNodeFromUrl = () => {
    const searchParams = new URLSearchParams(search);
    searchParams.delete(NODE_ADRESS_URL_PARAM);
    // push instead of replace to preserve previous node param history
    history.push({ search: searchParams.toString() });
  };

  const handleSwitchNode = () => {
    if (selectedNode !== nodeApi.address) {
      // remove param to update it during nodeApi init
      removeNodeFromUrl();
      localStorage.setItem(LOCAL_STORAGE.NODE_ADDRESS, selectedNode);
      window.location.reload();
    }
  };

  return (
    <div className="nodes">
      <div className="nodes__header">
        <button type="button" aria-label="arrowBack" onClick={handleSwitchNode} className="nodes__switch-button">
          <img src={refresh} className="nodes__switch-icon" alt="switch node" />
          <span className="nodes-hide-text">Switch</span>
        </button>
        <button type="button" aria-label="arrowBack" onClick={closeSidebar} className="nodes__hide-button">
          <img src={cross} alt="back" />
        </button>
      </div>
      <ul className="nodes__wrap">{getNodeSections()}</ul>
      <div className="nodes__add">
        <input type="text" className="nodes__add-input" value={nodeAddress} onChange={handleNodeAddressChange} />
        <button
          type="button"
          onClick={addNode}
          disabled={!isNodeAddressValid(nodeAddress)}
          className="nodes__add-button"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export { Sidebar };
