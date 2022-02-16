import React, { useState } from 'react';
import cross from 'assets/images/close.svg';
import refresh from 'assets/images/refresh2.svg';
import { nodeApi } from 'api/initApi';
import { useDispatch } from 'react-redux';
import { resetApiReady } from 'store/actions/actions';
import { useHistory, useLocation } from 'react-router-dom';
import { NODE_ADRESS_URL_PARAM, LOCAL_STORAGE } from 'consts';
import { Node as NodeType, NodeSection } from 'types/sidebar';
import { Section } from './Section/Section';
import { Node } from './Node/Node';
import './Sidebar.scss';

type Props = {
  closeSidebar: () => void;
  nodeSections: NodeSection[];
};

const Sidebar = ({ closeSidebar, nodeSections }: Props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const [selectedNode, setSelectedNode] = useState(nodeApi.address);

  const getNodes = (nodes: NodeType[]) =>
    nodes.map((node, index) => (
      <Node
        key={index}
        address={node.address}
        isCustom={node.isCustom}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />
    ));

  const getNodeSections = () =>
    nodeSections.map((section, index) => (
      <Section key={index} caption={section.caption}>
        {getNodes(section.nodes)}
      </Section>
    ));

  const removeNodeFromUrl = () => {
    const { search } = location;
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
      localStorage.setItem(LOCAL_STORAGE.NODES, JSON.stringify(nodeSections));
      dispatch(resetApiReady());
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
        <input
          id="addNode"
          type="text"
          // value={newNode}
          // onChange={(event) => setNewNode(event.target.value)}
          className="nodes__add-input"
        />
        <button
          type="button"
          // onClick={handleAddNode}
          // disabled={!isNodeAddressValid(newNode)}
          className="nodes__add-button"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export { Sidebar };
