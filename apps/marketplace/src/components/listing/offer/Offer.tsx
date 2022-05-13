import { GearKeyring, Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { ConfirmationModal } from 'components/modals';
import { MARKETPLACE_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from 'consts';
import { useAccount, useApi, useMarketplaceMeta, useStatus } from 'hooks';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { sendMessage } from 'utils';
import styles from './Offer.module.scss';

type Props = {
  bid: string;
  bidder: string;
  listingOwner: Hex;
  hash?: Hex;
};

type Params = {
  id: string;
};

function Offer({ bid, bidder, listingOwner, hash }: Props) {
  const { id } = useParams() as Params;
  const { api } = useApi();
  const { account } = useAccount();
  const { marketplaceMeta } = useMarketplaceMeta();
  const handleStatus = useStatus();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const decodedAddress = account ? GearKeyring.decodeAddress(account.address) : '';
  const isOwner = decodedAddress === listingOwner;
  const isSale = !!hash;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const accept = () => {
    if (account && marketplaceMeta) {
      const payload = {
        AcceptOffer: { nftContractId: NFT_CONTRACT_ADDRESS, tokenId: id, offerHash: hash },
      };

      sendMessage(api, account, MARKETPLACE_CONTRACT_ADDRESS, payload, marketplaceMeta, handleStatus);
    }
  };

  return (
    <>
      <div className={styles.offer}>
        <div className={styles.info}>
          <p className={styles.bid}>{bid}</p>
          <p className={styles.bidder}>{bidder}</p>
        </div>
        {isOwner && isSale && <Button text="Accept" size="small" onClick={openModal} />}
      </div>
      {isModalOpen && (
        <ConfirmationModal heading={`Do you agree to sell the item for ${bid}?`} close={closeModal} onSubmit={accept} />
      )}
    </>
  );
}

export default Offer;
