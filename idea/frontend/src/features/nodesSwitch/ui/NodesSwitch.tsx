import { useAlert, useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { useModal, useOutsideClick } from 'hooks';
import { AnimationTimeout, LocalStorage, NODE_ADRESS_URL_PARAM } from 'shared/config';
import { useNodes } from 'widgets/menu/helpers/useNodes';
import { OnboardingTooltip } from 'shared/ui/onboardingTooltip';
import { INITIAL_ENDPOINT } from 'features/api';

import { NodesButton } from './nodesButton';
import { NodesPopup } from './nodesPopup';

type Props = {
  isButtonFullWidth: boolean;
};

const NodesSwitch = ({ isButtonFullWidth }: Props) => {
  const { api, isApiReady, switchNetwork } = useApi();
  const nodeAddress = api?.provider.endpoint;

  const alert = useAlert();

  const { nodeSections, isNodesLoading, addLocalNode, removeLocalNode } = useNodes();
  const { showModal, closeModal } = useModal();

  const [searchParams, setSearchParams] = useSearchParams();

  const [isNodesOpen, setIsNodesOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(INITIAL_ENDPOINT);
  const [isModalHide, setIsModalHidden] = useState(true);

  const close = () => setIsNodesOpen(false);

  const ref = useOutsideClick<HTMLDivElement>(close, isModalHide);

  const chain = isApiReady ? api.runtimeChain.toHuman() : 'Loading...';
  const specName = isApiReady ? api.runtimeVersion.specName.toHuman() : 'Loading...';
  const specVersion = isApiReady ? api.runtimeVersion.specVersion.toHuman() : 'Loading...';

  const toggleNodesPopup = () => setIsNodesOpen((prevState) => !prevState);
  const closeNodesPopup = () => setIsNodesOpen(false);

  const closeNetworkModal = () => {
    closeModal();
    // it working faster than the event event propagation
    setTimeout(() => setIsModalHidden(true), 10);
  };

  const handleAddButtonClick = (address: string) => {
    addLocalNode(address);
    closeNetworkModal();

    setTimeout(() => document.getElementById(address)?.scrollIntoView(false), 10);
  };

  const switchNode = () => {
    searchParams.set(NODE_ADRESS_URL_PARAM, selectedNode);
    setSearchParams(searchParams);

    localStorage.setItem(LocalStorage.Node, selectedNode);

    switchNetwork({ endpoint: selectedNode })
      .then(() => closeNodesPopup())
      .catch(({ message }: Error) => alert.error(message));
  };

  const showAddNodeModal = () => {
    setIsModalHidden(false);

    showModal('network', { nodeSections, addNetwork: handleAddButtonClick, onClose: closeNetworkModal });
  };

  useEffect(() => {
    if (!nodeAddress) return;

    setSelectedNode(nodeAddress);
  }, [nodeAddress]);

  return (
    <div ref={ref}>
      <OnboardingTooltip index={9}>
        <NodesButton
          name={specName}
          chain={chain}
          version={specVersion}
          isApiReady={isApiReady}
          isOpen={isNodesOpen}
          isFullWidth={isButtonFullWidth}
          onClick={toggleNodesPopup}
        />
      </OnboardingTooltip>

      <CSSTransition in={isNodesOpen} timeout={AnimationTimeout.Default} mountOnEnter unmountOnExit>
        <NodesPopup
          chain={chain}
          isLoading={isNodesLoading}
          nodeAddress={nodeAddress}
          nodeSections={nodeSections}
          selectedNode={selectedNode}
          selectNode={setSelectedNode}
          removeNode={removeLocalNode}
          onSwitchButtonClick={switchNode}
          onAddButtonClick={showAddNodeModal}
          onCloseButtonClick={close}
        />
      </CSSTransition>
    </div>
  );
};

export { NodesSwitch };
