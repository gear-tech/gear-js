import { Hex } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import { ConfirmationModal } from 'components/modals';
import { useMarketplaceMessage, useWasm } from 'hooks';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const { account } = useAccount();

  const sendMessage = useMarketplaceMessage();
  const { nft } = useWasm();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isOwner = account?.decodedAddress === listingOwner;
  const isSale = !!hash;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const accept = () => {
    const payload = { AcceptOffer: { nftContractId: nft.programId, tokenId: id, offerHash: hash } };
    sendMessage(payload, { onSuccess: closeModal });
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

export { Offer };
