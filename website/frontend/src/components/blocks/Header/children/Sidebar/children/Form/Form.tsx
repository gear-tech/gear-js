import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { Button } from '@gear-js/ui';
import { isNodeAddressValid } from 'helpers';
import { nodeApi } from 'api/initApi';
import { Nodes, NodeSections } from '../../../../types';
import styles from './Form.module.scss';

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

  const [address, setAddress] = useState(isNodeExist(nodeApi.address) ? '' : nodeApi.address);

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
