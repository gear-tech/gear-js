import { useAccount, useMarketNft, useNft } from 'hooks';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NFTDetails } from 'types';
import AuctionListing from './auction-listing';
import OwnerListing from './owner-listing';
import SaleListing from './sale-listing';

type Params = {
  id: string;
};

function Listing() {
  const { id } = useParams() as Params;
  const { account } = useAccount();
  const nft = useNft(id);

  const [details, setDetails] = useState<NFTDetails>();
  const { royalty, rarity, attributes } = details || {};

  const marketNft = useMarketNft(id);
  const { price, auction, offers } = marketNft || {};
  const { startedAt, endedAt, currentPrice, bids } = auction || {};

  const isSale = !!price;
  const isAuction = !!auction;
  const isOwner = account?.decodedAddress === nft?.ownerId;

  useEffect(() => {
    const { reference } = nft || {};

    if (reference) {
      fetch(reference)
        .then((response) => response.json())
        .then(setDetails);
    }
  }, [nft]);

  // eslint-disable-next-line no-nested-ternary
  return nft ? (
    // eslint-disable-next-line no-nested-ternary
    isSale ? (
      <SaleListing
        id={id}
        isOwner={isOwner}
        heading={`${nft.name} #${id}`}
        description={nft.description}
        image={nft.media}
        owner={nft.ownerId}
        price={price}
        offers={offers || []}
        rarity={rarity}
        royalty={royalty}
        attrs={attributes}
      />
    ) : isAuction ? (
      <AuctionListing
        id={id}
        isOwner={isOwner}
        heading={`${nft.name} #${id}`}
        description={nft.description}
        image={nft.media}
        owner={nft.ownerId}
        price={currentPrice}
        offers={bids || []}
        rarity={rarity}
        royalty={royalty}
        attrs={attributes}
        startedAt={startedAt || ''}
        endedAt={endedAt || ''}
      />
    ) : (
      <OwnerListing
        id={id}
        isOwner={isOwner}
        heading={`${nft.name} #${id}`}
        description={nft.description}
        image={nft.media}
        owner={nft.ownerId}
        offers={offers || []}
        rarity={rarity}
        royalty={royalty}
        attrs={attributes}
      />
    )
  ) : null;
}

export default Listing;
