import { useState } from 'react';
import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { Listing, PriceModal } from 'components';
import { NFT_CONTRACT_ADDRESS } from 'consts';
import { useMarketplaceMessage } from 'hooks';
import { Offer as OfferType } from 'types';

type Props = {
  isOwner: boolean;
  id: string;
  heading: string;
  description: string;
  owner: Hex;
  image: string;
  offers: OfferType[];
  price?: string;
  royalty?: number;
  rarity?: string;
  attrs?: { [key: string]: string };
};

function AuctionListing(props: Props) {
  const { isOwner, id, heading, description, owner, image, offers, price, royalty, rarity, attrs } = props;
  const sendMessage = useMarketplaceMessage();

  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  const openPriceModal = () => {
    setIsPriceModalOpen(true);
  };

  const closeModal = () => {
    setIsPriceModalOpen(false);
  };

  const bid = (priceValue: string) => {
    const payload = { AddBid: { nftContractId: NFT_CONTRACT_ADDRESS, tokenId: id, price: priceValue } };
    sendMessage(payload, priceValue);
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
        {!isOwner && <Button text="Make bid" onClick={openPriceModal} block />}
      </Listing>
      {isPriceModalOpen && <PriceModal heading="Enter your bid" close={closeModal} onSubmit={bid} />}
    </>
  );
}

export default AuctionListing;
