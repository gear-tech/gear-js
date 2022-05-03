import { Button, Input, Modal } from '@gear-js/ui';
import { useInput } from 'hooks';
import styles from '../Listing.module.scss';

type Props = {
  close: () => void;
};

function SaleModal({ close }: Props) {
  const { value, handleChange } = useInput('');

  return (
    <Modal heading="Enter price to start sale" className={styles.modal} close={close}>
      <Input value={value} onChange={handleChange} />
      <Button text="Start sale" block />
    </Modal>
  );
}

export default SaleModal;
