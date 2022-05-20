import { useState } from 'react';
import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { Listing, PriceModal, ConfirmationModal } from 'components';
import { NFT_CONTRACT_ADDRESS } from 'consts';
import { useMarketplaceMessage } from 'hooks';
import { Offer as OfferType } from 'types';
import OnLogin from 'components/on-login';
import styles from './AuctionListing.module.scss';

type Props = {
  isOwner: boolean;
  id: string;
  heading: string;
  description: string;
  owner: Hex;
  image: string;
  offers: OfferType[];
  startedAt: string;
  endedAt: string;
  price?: string;
  royalty?: number;
  rarity?: string;
  attrs?: { [key: string]: string };
};

function AuctionListing(props: Props) {
  const { isOwner, id, heading, description, owner, image, offers, startedAt, endedAt, price, royalty, rarity, attrs } =
    props;

  const sendMessage = useMarketplaceMessage();
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const getTimestamp = (value: string) => +value.replaceAll(',', '');

  const startTimestamp = getTimestamp(startedAt);
  const endTimestamp = getTimestamp(endedAt);

  const startDate = new Date(startTimestamp).toLocaleString();
  const endDate = new Date(endTimestamp).toLocaleString();

  const currentTimestamp = new Date().getTime();
  const isAuctionOver = currentTimestamp > endTimestamp;

  const openPriceModal = () => {
    setIsPriceModalOpen(true);
  };

  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(true);
  };

  const closeModal = () => {
    setIsPriceModalOpen(false);
    setIsConfirmationModalOpen(false);
  };

  const bid = (priceValue: string) => {
    const payload = { AddBid: { nftContractId: NFT_CONTRACT_ADDRESS, tokenId: id, price: priceValue } };
    sendMessage(payload, priceValue).then(closeModal);
  };

  const settle = () => {
    const payload = { SettleAuction: { nftContractId: NFT_CONTRACT_ADDRESS, tokenId: id } };
    sendMessage(payload).then(closeModal);
  };

  return (
    <>
      <Listing
        heading={heading}
        description={description}
        owner={owner}
        image={image}
        offers={offers}
        price={price}
        royalty={royalty}
        rarity={rarity}
        attrs={attrs}>
        <div className={styles.body}>
          <p className={styles.time}>
            <span>Start time: {startDate}</span>
            <span>End time: {endDate}</span>
          </p>
          <OnLogin>
            {isOwner
              ? isAuctionOver && <Button text="Settle auction" onClick={openConfirmationModal} block />
              : !isAuctionOver && <Button text="Make bid" onClick={openPriceModal} block />}
          </OnLogin>
        </div>
      </Listing>
      {isPriceModalOpen && (
        <PriceModal heading={`Enter your bid. Min price is ${price}`} close={closeModal} onSubmit={bid} />
      )}
      {isConfirmationModalOpen && <ConfirmationModal heading="Settle auction?" close={closeModal} onSubmit={settle} />}
    </>
  );
}

export default AuctionListing;
