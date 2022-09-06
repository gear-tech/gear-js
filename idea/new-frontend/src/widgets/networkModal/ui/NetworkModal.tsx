import { FormEvent, useState, ChangeEvent } from 'react';
import { useAlert } from '@gear-js/react-hooks';
import { Modal, Input, Button } from '@gear-js/ui';

import { ModalProps } from 'entities/modal';
import { Node, NodeSection } from 'entities/node';
import { isNodeAddressValid } from 'shared/helpers';
import plusSVG from 'shared/assets/images/actions/plus.svg';

import styles from './NetworkModal.module.scss';

type Props = ModalProps & {
  localNodes: Node[];
  nodeSections: NodeSection[];
  addNetwork: (address: string) => void;
};
// TODO: use Final Form
const NetworkModal = ({ localNodes, nodeSections, addNetwork, onClose }: Props) => {
  const alert = useAlert();

  const isNodeExist = (address: string) => {
    const nodes = nodeSections.flatMap((section) => section.nodes);
    const concatedNodes = [...nodes, ...localNodes];

    return concatedNodes.some((node) => node.address === address.trim());
  };

  const [address, setAddress] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setAddress(event.target.value);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedAddress = address.trim();

    if (!isNodeAddressValid(trimmedAddress)) {
      alert.error('Address not valid!');

      return;
    }

    if (isNodeExist(trimmedAddress)) {
      alert.error('Address already exist!');

      return;
    }

    addNetwork(trimmedAddress);
    onClose();
  };

  return (
    <Modal heading="Add Network" close={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input name="network" value={address} onChange={handleChange} />
        <Button type="submit" icon={plusSVG} text="Add network" className={styles.addNetworkBtn} />
      </form>
    </Modal>
  );
};

export { NetworkModal };
