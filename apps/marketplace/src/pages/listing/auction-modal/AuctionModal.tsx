import { Button, Input, Modal } from '@gear-js/ui';
import { useInput } from 'hooks';
import styles from '../Listing.module.scss';

type Props = {
  close: () => void;
};

function AuctionModal({ close }: Props) {
  const { value, handleChange } = useInput('');
  const { value: duration, handleChange: handleDurationChange } = useInput('');

  return (
    <Modal heading="Auction" className={styles.modal} close={close}>
      <Input value={value} onChange={handleChange} />
      <Input value={duration} onChange={handleDurationChange} />
      <Button text="Start auction" block />
    </Modal>
  );
}

export default AuctionModal;
