import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import SimpleBar from 'simplebar-react';
import { Button } from '@gear-js/ui';

import { useApp, useModal, useOutsideClick } from 'hooks';
import { Node, NodeSection } from 'entities/node';
import { AnimationTimeout, LocalStorage, NODE_ADRESS_URL_PARAM } from 'shared/config';
import plusSVG from 'shared/assets/images/actions/plus.svg';
import switchSVG from 'shared/assets/images/actions/switch.svg';

import styles from './NodesPopup.module.scss';
import { getLocalNodes } from '../helpers';
import { Section } from './section';

type Props = {
  chain: string;
  isOpen: boolean;
  className?: string;
  nodeSections: NodeSection[];
  onClose: () => void;
};

const NodesPopup = (props: Props) => {
  const { chain, isOpen, className, nodeSections, onClose } = props;

  const { nodeAddress } = useApp();
  const { showModal } = useModal();

  const [searchParams, setSearchParams] = useSearchParams();

  const [localNodes, setLocalNodes] = useState<Node[]>(getLocalNodes);
  const [selectedNode, setSelectedNode] = useState(nodeAddress);
  const [isModalShowing, setIsModalShowing] = useState(false);

  const ref = useOutsideClick<HTMLElement>(onClose, isOpen && !isModalShowing);

  const addLocalNode = (address: string) => {
    setLocalNodes((prevNodes) => prevNodes.concat({ address, isCustom: true }));
    setSelectedNode(address);
    setIsModalShowing(false);
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
    searchParams.delete(NODE_ADRESS_URL_PARAM);
    // push instead of replace to preserve previous node param history
    setSearchParams(searchParams);

    localStorage.setItem(LocalStorage.NodeAddress, selectedNode);
    window.location.reload();
  };

  const showAddNodeModal = () => {
    setIsModalShowing(true);

    showModal('network', {
      localNodes,
      nodeSections,
      addNetwork: addLocalNode,
    });
  };

  useEffect(() => {
    localStorage.setItem(LocalStorage.Nodes, JSON.stringify(localNodes));
  }, [localNodes]);

  const isCurrentNode = selectedNode === nodeAddress;

  return (
    <CSSTransition in={isOpen} timeout={AnimationTimeout.Default} mountOnEnter unmountOnExit>
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
    </CSSTransition>
  );
};

export { NodesPopup };
