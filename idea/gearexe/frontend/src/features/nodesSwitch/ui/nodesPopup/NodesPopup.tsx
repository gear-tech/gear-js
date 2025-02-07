import clsx from 'clsx';

import CrossIcon from '@/assets/icons/cross.svg?react';

import { Node as NodeItem } from '../node';
import { Button } from '@/components';
import { nodeSections } from '../../config';
import { NodeSection } from '../../types';
import styles from './NodesPopup.module.scss';

type Props = {
  nodeAddress: string | undefined;
  selectedNode: string;
  selectNode: (address: string) => void;
  onSwitchButtonClick: () => void;
  onCloseButtonClick: () => void;
};

const NodesPopup = (props: Props) => {
  const { nodeAddress, selectedNode, selectNode, onSwitchButtonClick, onCloseButtonClick } = props;

  const isCurrentNode = selectedNode === nodeAddress;

  const getNodes = (section: NodeSection) =>
    section.nodes.map((node, index) => (
      <NodeItem
        // eslint-disable-next-line react/no-array-index-key
        key={`${node.address}-${index}`}
        address={node.address}
        selectedNode={selectedNode}
        selectNode={selectNode}
      />
    ));

  const getSections = () =>
    nodeSections.map((section, index) => (
      <li key={`${section.caption}-${index}`}>
        <h3 className={styles.caption}>{section.caption}</h3>
        <ul className={styles.sectionList}>{getNodes(section)}</ul>
      </li>
    ));

  return (
    <aside className={clsx(styles.nodesPopup)}>
      <div className={styles.content}>
        <ul className={styles.list}>{getSections()}</ul>

        <Button className={styles.action} size="sm" disabled={isCurrentNode} onClick={onSwitchButtonClick}>
          Switch to Vara
        </Button>
      </div>

      <Button variant="icon" className={styles.closeBtn} onClick={onCloseButtonClick}>
        <CrossIcon />
      </Button>
    </aside>
  );
};

export { NodesPopup };
