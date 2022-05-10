import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { Listing, PriceModal } from 'components';
import { MARKETPLACE_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from 'consts';
import { useAccount, useApi, useLoading, useMarketplaceMeta, useStatus } from 'hooks';
import { useState } from 'react';
import { sendMessage } from 'utils';

type Props = {
  isOwner: boolean;
  id: string;
  heading: string;
  description: string;
  owner: Hex;
  image: string;
  offers: any[];
  price?: string;
  royalty?: number;
  rarity?: string;
  attrs?: { [key: string]: string };
};

function AuctionListing(props: Props) {
  const { isOwner, id, heading, description, owner, image, offers, price, royalty, rarity, attrs } = props;

  const { api } = useApi();
  const { account } = useAccount();
  const { enableLoading } = useLoading();
  const { marketplaceMeta } = useMarketplaceMeta();
  const handleStatus = useStatus();

  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  const openPriceModal = () => {
    setIsPriceModalOpen(true);
  };

  const closeModal = () => {
    setIsPriceModalOpen(false);
  };

  const bid = (priceValue: string) => {
    if (account && marketplaceMeta) {
      enableLoading();

      const payload = { AddBid: { nftContractId: NFT_CONTRACT_ADDRESS, tokenId: id, price: priceValue } };
      sendMessage(api, account, MARKETPLACE_CONTRACT_ADDRESS, payload, marketplaceMeta, handleStatus, priceValue);
    }
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
