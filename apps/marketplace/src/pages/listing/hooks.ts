import { useAccount } from '@gear-js/react-hooks';
import { useMarketNft, useNft } from 'hooks';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NFTDetails } from 'types';

type Params = {
  id: string;
};

function useListing() {
  const { id } = useParams() as Params;
  const { account } = useAccount();

  const nft = useNft(id);
  const { name, description, ownerId, media, reference } = nft || {};

  const [details, setDetails] = useState<NFTDetails>();
  const { royalty, rarity, attributes } = details || {};

  const marketNft = useMarketNft(id);
  const { price, auction, offers } = marketNft || {};
  const { currentPrice, bids } = auction || {};

  const isSale = !!price;
  const isAuction = !!auction;
  const isListed = isSale || isAuction;
  const isOwner = account ? account.decodedAddress === ownerId : false;

  useEffect(() => {
    if (reference) {
      fetch(reference)
        .then((response) => response.json())
        .then(setDetails);
    }
  }, [reference]);

  const heading = `${name} #${id}`;

  return {
    heading,
    description,
    ownerId,
    media,
    reference,
    royalty,
    rarity,
    attributes,
    price,
    offers,
    currentPrice,
    bids,
    isSale,
    isAuction,
    isListed,
    isOwner,
  };
}

export { useListing };
