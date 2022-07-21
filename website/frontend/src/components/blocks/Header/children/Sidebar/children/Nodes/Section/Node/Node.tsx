import { Dispatch, SetStateAction } from 'react';
import { useAlert } from '@gear-js/react-hooks';
import { Button, Radio } from '@gear-js/ui';

import styles from './Node.module.scss';

import { copyToClipboard } from 'helpers';
import { NODE_API_ADDRESS } from 'context/api/const';
import { Node as NodeType } from 'types/api';
import copySVG from 'assets/images/copy.svg';
import trashSVG from 'assets/images/trash.svg';

type Props = {
  address: string;
  isCustom: boolean;
  setLocalNodes: Dispatch<React.SetStateAction<NodeType[]>>;
  selectedNode: string;
  setSelectedNode: Dispatch<SetStateAction<string>>;
};

function Node({ address, isCustom, setLocalNodes, selectedNode, setSelectedNode }: Props) {
  const alert = useAlert();

  const handleChange = () => {
    setSelectedNode(address);
  };

  const handleCopy = () => {
    copyToClipboard(address, alert, 'Node address copied');
  };

  const removeNode = () => {
    setLocalNodes((prevNodes) => prevNodes.filter((prevNode) => prevNode.address !== address));

    if (selectedNode === address) {
      setSelectedNode(NODE_API_ADDRESS);
    }
  };

  return (
    <li className={styles.node}>
      <Radio
        label={address}
        name="node"
        className={styles.radio}
        checked={selectedNode === address}
        onChange={handleChange}
      />
      <div className={styles.buttons}>
        <Button aria-label="Copy node address" icon={copySVG} color="transparent" onClick={handleCopy} />
        {isCustom && (
          <Button
            aria-label="Remove node address"
            icon={trashSVG}
            color="transparent"
            onClick={removeNode}
            disabled={address === NODE_API_ADDRESS}
          />
        )}
      </div>
    </li>
  );
}

export { Node };
