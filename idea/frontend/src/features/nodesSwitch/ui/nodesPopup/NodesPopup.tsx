import { Button } from '@gear-js/ui';

import { ReactComponent as plusSVG } from 'shared/assets/images/actions/plus.svg';
import { ReactComponent as closeSVG } from 'shared/assets/images/actions/close.svg';
import { ReactComponent as switchSVG } from 'shared/assets/images/actions/switch.svg';
import { NodeSection } from 'entities/node';

import { NodesList } from '../nodesList';
import styles from './NodesPopup.module.scss';

type Props = {
  chain: string | undefined;
  nodeAddress: string;
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

  return (
    <aside className={styles.nodesPopup}>
      <div className={styles.content}>
        <h1 className={styles.chain}>{chain}</h1>
        <NodesList
          nodeAddress={nodeAddress}
          nodeSections={nodeSections}
          selectedNode={selectedNode}
          selectNode={selectNode}
          removeLocalNode={removeNode}
        />
        <div className={styles.actions}>
          <Button icon={switchSVG} text="Switch" disabled={isCurrentNode} onClick={onSwitchButtonClick} />
          <Button icon={plusSVG} color="secondary" onClick={onAddButtonClick} />
        </div>
      </div>
      <Button icon={closeSVG} color="transparent" className={styles.closeBtn} onClick={onCloseButtonClick} />
    </aside>
  );
};

export { NodesPopup };
