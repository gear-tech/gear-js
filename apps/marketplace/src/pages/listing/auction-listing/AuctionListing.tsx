import { useState } from 'react';
import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { Listing, PriceModal } from 'components';
import { NFT_CONTRACT_ADDRESS } from 'consts';
import { useMarketplaceMessage } from 'hooks';
import { Offer as OfferType } from 'types';
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

  const startDate = new Date(+startedAt.replaceAll(',', '')).toLocaleString();
  const endDate = new Date(+endedAt.replaceAll(',', '')).toLocaleString();

  const openPriceModal = () => {
    setIsPriceModalOpen(true);
  };

  const closeModal = () => {
    setIsPriceModalOpen(false);
  };

  const bid = (priceValue: string) => {
    const payload = { AddBid: { nftContractId: NFT_CONTRACT_ADDRESS, tokenId: id, price: priceValue } };
    sendMessage(payload, priceValue).then(closeModal);
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
        {!isOwner && (
          <div className={styles.body}>
            <p className={styles.time}>
              <span>Start time: {startDate}</span>
              <span>End time: {endDate}</span>
            </p>
            <Button text="Make bid" onClick={openPriceModal} block />
          </div>
        )}
      </Listing>
      {isPriceModalOpen && <PriceModal heading="Enter your bid" close={closeModal} onSubmit={bid} />}
    </>
  );
}

export default AuctionListing;
