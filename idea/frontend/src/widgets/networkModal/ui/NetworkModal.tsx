import { FormEvent, useState, ChangeEvent } from 'react';
import { useAlert } from '@gear-js/react-hooks';
import { Modal, Input, Button } from '@gear-js/ui';

import { ModalProps } from '@/entities/modal';
import { NodeSection } from '@/entities/node';
import { isNodeAddressValid } from '@/shared/helpers';
import plusSVG from '@/shared/assets/images/actions/plus.svg?react';

import styles from './NetworkModal.module.scss';

type Props = ModalProps & {
  nodeSections: NodeSection[];
  addNetwork: (address: string) => void;
};

const NetworkModal = ({ nodeSections, addNetwork, onClose }: Props) => {
  const alert = useAlert();

  const [address, setAddress] = useState('');

  const isNodeExist = (nodeAddress: string) => {
    const nodes = nodeSections.flatMap((section) => section.nodes);

    return nodes.some((node) => node.address === nodeAddress);
  };

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
