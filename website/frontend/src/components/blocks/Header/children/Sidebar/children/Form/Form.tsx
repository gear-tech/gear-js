import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { Button } from 'common/components/Button/Button';
import { isNodeAddressValid } from 'helpers';
import { nodeApi } from 'api/initApi';
import { Node, NodeSection } from 'types/sidebar';
import styles from './Form.module.scss';

type Props = {
  nodeSections: NodeSection[];
  localNodes: Node[];
  setLocalNodes: Dispatch<SetStateAction<Node[]>>;
};

const Form = ({ nodeSections, localNodes, setLocalNodes }: Props) => {
  const isNodeExist = (address: string) => {
    const nodes = nodeSections.flatMap((section) => section.nodes);
    const concatedNodes = [...nodes, ...localNodes];
    return concatedNodes.some((node) => node.address === address);
  };

  const [nodeAddress, setNodeAddress] = useState(isNodeExist(nodeApi.address) ? '' : nodeApi.address);

  const handleNodeAddressChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setNodeAddress(value);
  };

  const addNode = () => {
    if (!isNodeExist(nodeAddress)) {
      const node = { address: nodeAddress, custom: true };
      setLocalNodes((prevNodes) => [...prevNodes, node]);
      setNodeAddress('');
    }
  };

  return (
    <form className={styles.form}>
      <input type="text" className={styles.input} value={nodeAddress} onChange={handleNodeAddressChange} />
      <Button text="Add" onClick={addNode} disabled={!isNodeAddressValid(nodeAddress)} />
    </form>
  );
};

export { Form };
