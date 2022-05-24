import { Button, Input, Modal } from '@gear-js/ui';
import { NFT_CONTRACT_ADDRESS } from 'consts';
import { useForm, useMarketplaceMessage } from 'hooks';
import { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import styles from './AuctionModal.module.scss';

type Props = {
  close: () => void;
};

type Params = {
  id: string;
};

const MILLISECONDS_MULTIPLIER = 60000;

function AuctionModal({ close }: Props) {
  const { id } = useParams() as Params;

  const { values, handleChange } = useForm({ minPrice: '', duration: '', bidPeriod: '' });
  const { minPrice, duration, bidPeriod } = values;

  const sendMessage = useMarketplaceMessage();

  const getMilliseconds = (value: string) => Number(value) * MILLISECONDS_MULTIPLIER;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (minPrice && duration) {
      const payload = {
        CreateAuction: {
          nftContractId: NFT_CONTRACT_ADDRESS,
          ftContractId: null,
          tokenId: id,
          duration: getMilliseconds(duration),
          bidPeriod: getMilliseconds(bidPeriod),
          minPrice,
        },
      };

      sendMessage(payload).then(close);
    }
  };

  return (
    <Modal heading="Auction" close={close}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input placeholder="min price" name="minPrice" value={minPrice} onChange={handleChange} />
        <Input placeholder="duration (min)" name="duration" value={duration} onChange={handleChange} />
        <Input placeholder="bid period (min)" name="bidPeriod" value={bidPeriod} onChange={handleChange} />
        <Button type="submit" text="Start auction" block />
      </form>
    </Modal>
  );
}

export default AuctionModal;
