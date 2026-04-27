import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { myActivityAtom, type NodeState, nodeAtom } from '@/app/store';

import { NODE_SECTIONS } from '../api';
import { getSectionByNodeAddress, LocalStorage, NODE_ADRESS_URL_PARAM } from '../config';

import { NodesButton } from './nodes-button';
import { NodesPopup } from './nodes-popup';
import styles from './nodes-switch.module.scss';

const NodesSwitch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const nodeState = useAtomValue(nodeAtom);
  const setNodeState = useSetAtom(nodeAtom);
  const setMyActivity = useSetAtom(myActivityAtom);

  const [isNodesOpen, setIsNodesOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(nodeState.varaEthNodeAddress);

  const close = () => setIsNodesOpen(false);

  const chain = getSectionByNodeAddress(nodeState.varaEthNodeAddress).caption;

  const toggleNodesPopup = () => setIsNodesOpen((prevState) => !prevState);
  const closeNodesPopup = () => setIsNodesOpen(false);

  const switchNode = () => {
    const section = getSectionByNodeAddress(selectedNode);

    const nextNodeState: NodeState = {
      varaEthNodeAddress: selectedNode,
      ethChainId: section.ethChainId,
      ethNodeAddress: section.ethNodeAddress,
      explorerUrl: section.explorerUrl,
      routerContractAddress: section.routerContractAddress,
    };

    // Prevent mixing activity entries from different networks.
    setMyActivity([]);
    setNodeState(nextNodeState);

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set(NODE_ADRESS_URL_PARAM, selectedNode);
    setSearchParams(nextSearchParams);

    localStorage.setItem(LocalStorage.Node, selectedNode);

    closeNodesPopup();
  };

  useEffect(() => {
    setSelectedNode(nodeState.varaEthNodeAddress);
  }, [nodeState.varaEthNodeAddress]);

  return (
    <div className={styles.wrapper}>
      <NodesButton name={chain} isOpen={isNodesOpen} onClick={toggleNodesPopup} />

      {isNodesOpen && (
        <NodesPopup
          sections={NODE_SECTIONS}
          nodeAddress={nodeState.varaEthNodeAddress}
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
