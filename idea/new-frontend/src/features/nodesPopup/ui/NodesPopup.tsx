import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import { Button } from '@gear-js/ui';

import { useApp, useModal, useOutsideClick } from 'hooks';
import { NodeSection } from 'entities/node';
import { AnimationTimeout, NODE_ADRESS_URL_PARAM } from 'shared/config';
import plusSVG from 'shared/assets/images/actions/plus.svg';
import closeSVG from 'shared/assets/images/actions/close.svg';
import switchSVG from 'shared/assets/images/actions/switch.svg';

import styles from './NodesPopup.module.scss';

import { NodesList } from './nodesList';

type Props = {
  chain?: string;
  isLoading: boolean;
  className?: string;
  nodeSections: NodeSection[];
  onClose: () => void;
  onLocalNodeAdd: (address: string) => void;
  onLocalNodeRemove: (address: string) => void;
};

const NodesPopup = (props: Props) => {
  const { chain, isLoading, className, nodeSections, onClose, onLocalNodeAdd, onLocalNodeRemove } = props;

  const { nodeAddress } = useApp();
  const { showModal, closeModal } = useModal();

  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedNode, setSelectedNode] = useState(nodeAddress);
  const [isModalHide, setIsModalHidden] = useState(true);

  const ref = useOutsideClick<HTMLElement>(onClose, isModalHide);

  const closeNetworkModal = () => {
    closeModal();
    // it working faster than the event event propagation
    setTimeout(() => setIsModalHidden(true), 10);
  };

  const addLocalNode = (address: string) => {
    onLocalNodeAdd(address);
    setSelectedNode(address);

    closeNetworkModal();

    setTimeout(() => document.getElementById(address)?.scrollIntoView(false), 10);
  };

  const removeLocalNode = useCallback(
    (address: string) => {
      onLocalNodeRemove(address);

      if (address === selectedNode) {
        setSelectedNode(nodeAddress);
      }
    },
    [selectedNode, nodeAddress, onLocalNodeRemove],
  );

  const switchNode = () => {
    // remove param to update it during nodeApi init
    searchParams.set(NODE_ADRESS_URL_PARAM, selectedNode);
    setSearchParams(searchParams);

    window.location.reload();
  };

  const showAddNodeModal = () => {
    setIsModalHidden(false);

    showModal('network', {
      nodeSections,
      addNetwork: addLocalNode,
      onClose: closeNetworkModal,
    });
  };

  const isCurrentNode = selectedNode === nodeAddress;

  return (
    <aside ref={ref} className={clsx(styles.nodesPopup, isLoading && styles.loading, className)}>
      <CSSTransition in={!isLoading} timeout={AnimationTimeout.Default} mountOnEnter>
        <div className={styles.content}>
          <h1 className={styles.chain}>{chain}</h1>
          <NodesList
            nodeAddress={nodeAddress}
            nodeSections={nodeSections}
            selectedNode={selectedNode}
            selectNode={setSelectedNode}
            removeLocalNode={removeLocalNode}
          />
          <div className={styles.actions}>
            <Button icon={switchSVG} text="Switch" disabled={isCurrentNode} onClick={switchNode} />
            <Button icon={plusSVG} color="secondary" onClick={showAddNodeModal} />
          </div>
        </div>
      </CSSTransition>
      <Button icon={closeSVG} color="transparent" className={styles.closeBtn} onClick={onClose} />
    </aside>
  );
};

export { NodesPopup };
