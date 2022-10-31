import { ButtonProps } from '@gear-js/ui';
import { Auction, BaseNFT, MarketNFT, NFT, NFTDetails } from 'types';
import { getIpfsAddress } from 'utils';

const getHeading = (name: string, id: string) => `${name} #${id}`;
const getTimestamp = (value: string) => +value.replaceAll(',', '');

function getButtonText(isOwner: boolean, isAuction: boolean) {
  if (!isOwner) {
    if (isAuction) {
      return 'Make bid';
    }

    return 'Buy now';
  }

  return 'Your item';
}

function getNFTProps(nft: NFT, isOwner: boolean) {
  const { id, auction, price, media, name } = nft;

  const { currentPrice } = auction || {};
  const isAuction = !!auction;

  const path = `/listing/${id}`;
  const src = getIpfsAddress(media);
  const text = `#${id}`;

  const priceProp = {
    heading: isAuction ? 'Top bid' : 'Price',
    text: price || currentPrice || 'None',
  };

  const buttonProp: { text: string; color: ButtonProps['color'] } = {
    text: getButtonText(isOwner, isAuction),
    color: isOwner ? 'secondary' : 'primary',
  };

  return { name, path, src, text, button: price ? buttonProp : undefined, price: priceProp };
}

function getListingProps(baseNft: BaseNFT, marketNft: MarketNFT, details: NFTDetails | undefined) {
  const { id, name, description, ownerId, media } = baseNft;
  const { auction } = marketNft;
  const { rarity, attributes } = details || {};

  const heading = getHeading(name, id);
  const src = getIpfsAddress(media);

  const offers = auction ? auction.bids : marketNft.offers;
  const price = auction ? auction.currentPrice : marketNft.price;

  return { heading, description, owner: ownerId, price, src, rarity, attrs: attributes, offers };
}

function getAuctionDate(auction: Auction) {
  const { startedAt, endedAt } = auction;

  const startTimestamp = getTimestamp(startedAt);
  const endTimestamp = getTimestamp(endedAt);
  const currentTimestamp = new Date().getTime();
  const startDate = new Date(startTimestamp).toLocaleString();
  const endDate = new Date(endTimestamp).toLocaleString();
  const isAuctionOver = currentTimestamp > endTimestamp;

  return { startDate, endDate, isAuctionOver };
}

export { getNFTProps, getListingProps, getAuctionDate };
