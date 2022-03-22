import React, { Dispatch, SetStateAction } from 'react';
import { useAlert } from 'react-alert';
import copy from 'assets/images/copy.svg';
import trash from 'assets/images/trash.svg';
import { Button } from 'common/components/Button/Button';
import { Radio } from 'common/components/Radio/Radio';
import { nodeApi } from 'api/initApi';
import { copyToClipboard } from 'helpers';
import { Nodes } from '../../../../../../types';
import styles from './Node.module.scss';

type Props = {
  address: string;
  isCustom: boolean;
  setLocalNodes: Dispatch<React.SetStateAction<Nodes>>;
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
        <Button icon={copy} color="transparent" onClick={handleCopy} />
        {isCustom && (
          <Button icon={trash} color="transparent" onClick={removeNode} disabled={address === nodeApi.address} />
        )}
      </div>
    </li>
  );
};

export { Node };
