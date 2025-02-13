import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { NodesButton } from './nodes-button';
import { NodesPopup } from './nodes-popup';
import { INITIAL_ENDPOINT, LocalStorage, NODE_ADRESS_URL_PARAM } from '../config';

const NodesSwitch = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isNodesOpen, setIsNodesOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(INITIAL_ENDPOINT);

  const close = () => setIsNodesOpen(false);

  const chain = 'Gear.EXE';

  const toggleNodesPopup = () => setIsNodesOpen((prevState) => !prevState);
  const closeNodesPopup = () => setIsNodesOpen(false);

  const switchNode = () => {
    searchParams.set(NODE_ADRESS_URL_PARAM, selectedNode);
    setSearchParams(searchParams);

    localStorage.setItem(LocalStorage.Node, selectedNode);

    closeNodesPopup();
  };

  return (
    <div>
      <NodesButton name={chain} isOpen={isNodesOpen} onClick={toggleNodesPopup} />

      {isNodesOpen && (
        <NodesPopup
          nodeAddress={chain}
          selectedNode={selectedNode}
          selectNode={setSelectedNode}
          onSwitchButtonClick={switchNode}
          onCloseButtonClick={close}
        />
      )}
    </div>
  );
};

export { NodesSwitch };
