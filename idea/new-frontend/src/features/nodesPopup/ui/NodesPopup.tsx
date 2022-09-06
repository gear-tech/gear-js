import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import SimpleBar from 'simplebar-react';
import { Button } from '@gear-js/ui';

import { useApp, useModal, useOutsideClick } from 'hooks';
import { Node, NodeSection } from 'entities/node';
import { LocalStorage, NODE_ADRESS_URL_PARAM } from 'shared/config';
import plusSVG from 'shared/assets/images/actions/plus.svg';
import switchSVG from 'shared/assets/images/actions/switch.svg';

import styles from './NodesPopup.module.scss';
import { getLocalNodes } from '../helpers';
import { Section } from './section';

type Props = {
  chain: string;
  className?: string;
  nodeSections: NodeSection[];
  onClose: () => void;
};

const NodesPopup = (props: Props) => {
  const { chain, className, nodeSections, onClose } = props;

  const { nodeAddress } = useApp();
  const { showModal, closeModal } = useModal();

  const [searchParams, setSearchParams] = useSearchParams();

  const [localNodes, setLocalNodes] = useState<Node[]>(getLocalNodes);
  const [selectedNode, setSelectedNode] = useState(nodeAddress);
  const [isModalHide, setIsModalHidden] = useState(true);

  const ref = useOutsideClick<HTMLElement>(onClose, isModalHide);

  const closeNetworkModal = () => {
    closeModal();
    // it working faster than the event event propagation
    setTimeout(() => setIsModalHidden(true), 10);
  };

  const addLocalNode = (address: string) => {
    setLocalNodes((prevNodes) => prevNodes.concat({ address, isCustom: true }));
    setSelectedNode(address);
    closeNetworkModal();

    setTimeout(() => document.getElementById(address)?.scrollIntoView(false), 10);
  };

  const removeLocalNode = useCallback(
    (address: string) => {
      setLocalNodes((prevNodes) => prevNodes.filter((node) => node.address !== address));

      if (selectedNode === address) {
        setSelectedNode(nodeAddress);
      }
    },
    [selectedNode, nodeAddress],
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
      localNodes,
      nodeSections,
      addNetwork: addLocalNode,
      onClose: closeNetworkModal,
    });
  };

  useEffect(() => {
    localStorage.setItem(LocalStorage.Nodes, JSON.stringify(localNodes));
  }, [localNodes]);

  useEffect(() => {
    document.getElementById(selectedNode)?.scrollIntoView(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCurrentNode = selectedNode === nodeAddress;

  return (
    <aside ref={ref} className={clsx(styles.nodesPopup, className)}>
      <h1 className={styles.chain}>{chain}</h1>
      <SimpleBar className={styles.simpleBar}>
        <ul className={styles.list}>
          {nodeSections.map((section, index) => (
            <Section
              // eslint-disable-next-line react/no-array-index-key
              key={`${section.caption}-${index}`}
              section={section}
              localNodes={localNodes}
              nodeAddress={nodeAddress}
              selectedNode={selectedNode}
              selectNode={setSelectedNode}
              removeLocalNode={removeLocalNode}
            />
          ))}
        </ul>
      </SimpleBar>
      <div className={styles.actions}>
        <Button icon={switchSVG} text="Switch" disabled={isCurrentNode} onClick={switchNode} />
        <Button icon={plusSVG} color="secondary" onClick={showAddNodeModal} />
      </div>
    </aside>
  );
};

export { NodesPopup };
