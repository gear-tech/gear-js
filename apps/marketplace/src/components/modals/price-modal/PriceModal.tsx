import { Button, Input, Modal } from '@gear-js/ui';
import { useInput } from 'hooks';
import { FormEvent } from 'react';
import styles from './PriceModal.module.scss';

type Props = {
  heading: string;
  close: () => void;
  onSubmit: (price: string) => void;
};

function PriceModal({ heading, close, onSubmit }: Props) {
  const { value: price, handleChange: handlePriceChange } = useInput('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Number(price) > 0) onSubmit(price);
  };

  return (
    <Modal heading={heading} close={close}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input value={price} onChange={handlePriceChange} />
        <Button type="submit" text="OK" block />
      </form>
    </Modal>
  );
}

export default PriceModal;
