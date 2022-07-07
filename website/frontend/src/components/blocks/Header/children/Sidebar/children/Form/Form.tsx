import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { Button } from '@gear-js/ui';

import styles from './Form.module.scss';
import { Nodes, NodeSections } from '../../../../types';

import { isNodeAddressValid } from 'helpers';
import { NODE_API_ADDRESS } from 'context/api/const';

type Props = {
  nodeSections: NodeSections;
  localNodes: Nodes;
  setLocalNodes: Dispatch<SetStateAction<Nodes>>;
};

const Form = ({ nodeSections, localNodes, setLocalNodes }: Props) => {
  const isNodeExist = (address: string) => {
    const nodes = nodeSections.flatMap((section) => section.nodes);
    const concatedNodes = [...nodes, ...localNodes];
    return concatedNodes.some((node) => node.address === address);
  };

  const [address, setAddress] = useState(isNodeExist(NODE_API_ADDRESS) ? '' : NODE_API_ADDRESS);

  const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setAddress(value);
  };

  const addNode = () => {
    const node = { address, isCustom: true };
    setLocalNodes((prevNodes) => [...prevNodes, node]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addNode();
    setAddress('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input type="text" className={styles.input} value={address} onChange={handleChange} />
      <Button type="submit" text="Add" disabled={!isNodeAddressValid(address) || isNodeExist(address)} />
    </form>
  );
};

export { Form };
