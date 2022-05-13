import { Button, Input, Modal } from '@gear-js/ui';
import { marketplaceMetaWasm } from 'assets';
import { MARKETPLACE_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from 'consts';
import { useAccount, useApi, useForm, useLoading, useMetadata, useStatus } from 'hooks';
import { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import sendMessage from 'utils';
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

  const { api } = useApi();
  const { account } = useAccount();
  const { metadata } = useMetadata(marketplaceMetaWasm);
  const { enableLoading } = useLoading();
  const handleStatus = useStatus();

  const getMilliseconds = (value: string) => Number(value) * MILLISECONDS_MULTIPLIER;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (account && metadata && minPrice && duration) {
      enableLoading();

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

      sendMessage(api, account, MARKETPLACE_CONTRACT_ADDRESS, payload, metadata, handleStatus);
    }
  };

  return (
    <Modal heading="Auction" close={close}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input placeholder="min price" name="minPrice" value={minPrice} onChange={handleChange} />
        <Input placeholder="duration" name="duration" value={duration} onChange={handleChange} />
        <Input placeholder="bid period" name="bidPeriod" value={bidPeriod} onChange={handleChange} />
        <Button type="submit" text="Start auction" block />
      </form>
    </Modal>
  );
}

export default AuctionModal;
