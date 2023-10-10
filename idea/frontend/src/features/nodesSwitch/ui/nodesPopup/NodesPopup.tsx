import { Button } from '@gear-js/ui';
import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';
import SimpleBar from 'simplebar-react';

import { AnimationTimeout } from '@/shared/config';
import plusSVG from '@/shared/assets/images/actions/plus.svg?react';
import closeSVG from '@/shared/assets/images/actions/close.svg?react';
import switchSVG from '@/shared/assets/images/actions/switch.svg?react';
import { NodeSection } from '@/entities/node';

import { Node as NodeItem } from '../node';
import styles from './NodesPopup.module.scss';

type Props = {
  chain: string | undefined;
  isLoading: boolean;
  nodeAddress: string | undefined;
  nodeSections: NodeSection[];
  selectedNode: string;
  selectNode: (address: string) => void;
  removeNode: (address: string) => void;
  onSwitchButtonClick: () => void;
  onAddButtonClick: () => void;
  onCloseButtonClick: () => void;
};

const NodesPopup = (props: Props) => {
  const {
    chain,
    isLoading,
    nodeAddress,
    nodeSections,
    selectedNode,
    selectNode,
    removeNode,
    onSwitchButtonClick,
    onAddButtonClick,
    onCloseButtonClick,
  } = props;

  const isCurrentNode = selectedNode === nodeAddress;

  const getNodes = (section: NodeSection) =>
    section.nodes.map((node, index) => (
      <NodeItem
        // eslint-disable-next-line react/no-array-index-key
        key={`${node.address}-${index}`}
        address={node.address}
        isCustom={node.isCustom}
        icon={node.icon}
        nodeAddress={nodeAddress}
        selectedNode={selectedNode}
        selectNode={selectNode}
        removeLocalNode={removeNode}
      />
    ));

  const getSections = () =>
    nodeSections.map((section, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <li key={`${section.caption}-${index}`}>
        <h2 className={styles.caption}>{section.caption}</h2>
        <ul className={styles.sectionList}>{getNodes(section)}</ul>
      </li>
    ));

  return (
    <aside className={clsx(styles.nodesPopup, isLoading && styles.loading)}>
      <CSSTransition in={!isLoading} timeout={AnimationTimeout.Default} mountOnEnter>
        <div className={styles.content}>
          <h2 className={styles.chain}>{chain}</h2>

          <SimpleBar className={styles.simpleBar}>
            <ul className={styles.list}>{getSections()}</ul>
          </SimpleBar>

          <div className={styles.actions}>
            <Button icon={switchSVG} text="Switch" disabled={isCurrentNode} onClick={onSwitchButtonClick} />
            <Button icon={plusSVG} color="secondary" onClick={onAddButtonClick} />
          </div>
        </div>
      </CSSTransition>

      <Button icon={closeSVG} color="transparent" className={styles.closeBtn} onClick={onCloseButtonClick} />
    </aside>
  );
};

export { NodesPopup };
