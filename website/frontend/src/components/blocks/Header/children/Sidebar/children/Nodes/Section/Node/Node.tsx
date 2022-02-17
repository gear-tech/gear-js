import React, { Dispatch, SetStateAction } from 'react';
import { useAlert } from 'react-alert';
import { Trash2 } from 'react-feather';
import copy from 'assets/images/copy.svg';
import { Radio } from 'common/components/Radio/Radio';
import { nodeApi } from 'api/initApi';
import { copyToClipboard } from 'helpers';
import { Node as NodeType } from 'types/sidebar';
import styles from './Node.module.scss';

type Props = {
  address: string;
  isCustom: boolean;
  setLocalNodes: Dispatch<React.SetStateAction<NodeType[]>>;
  selectedNode: string;
  setSelectedNode: Dispatch<SetStateAction<string>>;
};

const Node = ({ address, isCustom, setLocalNodes, selectedNode, setSelectedNode }: Props) => {
  const alert = useAlert();

  const handleChange = () => {
    setSelectedNode(address);
  };

  const handleCopy = () => {
    copyToClipboard(address, alert, 'Node address copied');
  };

  const removeNode = () => {
    setLocalNodes((prevNodes) => prevNodes.filter((prevNode) => prevNode.address !== address));
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
        <button type="button" onClick={handleCopy}>
          <img src={copy} alt="copy node address" />
        </button>
        {isCustom && (
          <button type="button" onClick={removeNode} disabled={address === nodeApi.address}>
            <Trash2 color="#ffffff" size="22" strokeWidth="1.5" />
          </button>
        )}
      </div>
    </li>
  );
};

export { Node };
