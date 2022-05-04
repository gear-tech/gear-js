import { Button, Input, Modal } from '@gear-js/ui';
import { marketplaceMetaWasm } from 'assets';
import { MARKETPLACE_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from 'consts';
import { useAccount, useApi, useInput, useLoading, useMetadata, useStatus } from 'hooks';
import { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { sendMessage } from 'utils';
import styles from '../Listing.module.scss';

type Props = {
  close: () => void;
};

type Params = {
  id: string;
};

function SaleModal({ close }: Props) {
  const { id } = useParams() as Params;

  const { value: price, handleChange: handlePriceChange } = useInput('');

  const { api } = useApi();
  const { account } = useAccount();
  const { metadata } = useMetadata(marketplaceMetaWasm);
  const { enableLoading } = useLoading();
  const handleStatus = useStatus();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (account && metadata && price) {
      enableLoading();

      const payload = {
        AddMarketData: {
          nftContractId: NFT_CONTRACT_ADDRESS,
          ftContractId: null,
          tokenId: id,
          price,
        },
      };

      sendMessage(api, account, MARKETPLACE_CONTRACT_ADDRESS, payload, metadata, handleStatus);
    }
  };

  return (
    <Modal heading="Enter price to start sale" close={close}>
      <form className={styles.modal} onSubmit={handleSubmit}>
        <Input value={price} onChange={handlePriceChange} />
        <Button type="submit" text="Start sale" block />
      </form>
    </Modal>
  );
}

export default SaleModal;
