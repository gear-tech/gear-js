import { Button, Input, Modal } from '@gear-js/ui';
import { useInput } from 'hooks';
import { FormEvent } from 'react';
import styles from './PriceModal.module.scss';

type Props = {
  close: () => void;
  onSubmit: (price: string) => void;
};

function PriceModal({ close, onSubmit }: Props) {
  const { value: price, handleChange: handlePriceChange } = useInput('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Number(price) > 0) onSubmit(price);
  };

  return (
    <Modal heading="Enter price to start sale" close={close}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input value={price} onChange={handlePriceChange} />
        <Button type="submit" text="Start sale" block />
      </form>
    </Modal>
  );
}

export default PriceModal;
