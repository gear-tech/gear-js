import { useAccount } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NFTDetails } from 'types';
import { useMarketNft, useMarketplaceActions, useNft } from 'hooks';
import { getAuctionDate, getIpfsAddress, getListingProps } from 'utils';
import { Loader } from 'components';
import { AuctionListing } from './auction-listing';
import { OwnerListing } from './owner-listing';
import { SaleListing } from './sale-listing';

type Params = {
  id: string;
};

function Listing() {
  const { id } = useParams() as Params;
  const { account } = useAccount();

  const nft = useNft(id);
  const { reference, ownerId } = nft || {};
  const isOwner = account?.decodedAddress === ownerId;

  const marketNft = useMarketNft(id);
  const { price, auction } = marketNft || {};
  const isSale = !!price;
  const isAuction = !!auction;
  const isListed = isSale || isAuction;

  const { buy, offer, bid, settle, startSale, startAuction } = useMarketplaceActions(id, price);
  const [details, setDetails] = useState<NFTDetails>();

  useEffect(() => {
    if (reference) {
      fetch(getIpfsAddress(reference))
        .then((response) => response.json())
        .then(setDetails);
    }
  }, [reference]);

  return nft && marketNft && details ? (
    <>
      {isSale && (
        <SaleListing
          isOwner={isOwner}
          item={getListingProps(nft, marketNft, details)}
          onBuySubmit={buy}
          onOfferSubmit={offer}
        />
      )}
      {isAuction && (
        <AuctionListing
          isOwner={isOwner}
          item={getListingProps(nft, marketNft, details)}
          date={getAuctionDate(auction)}
          onBidSubmit={bid}
          onSettleSubmit={settle}
        />
      )}
      {!isListed && (
        <OwnerListing
          isOwner={isOwner}
          item={getListingProps(nft, marketNft, details)}
          onAuctionSubmit={startAuction}
          onSaleSubmit={startSale}
        />
      )}
    </>
  ) : (
    <Loader />
  );
}

export { Listing };
