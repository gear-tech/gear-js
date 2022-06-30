import { ButtonProps } from '@gear-js/ui';
import { ADDRESS } from 'consts';
import { NFT } from 'types';
import { getIpfsAddress } from 'utils';

const getMarketNFTPayload = (tokenId: string) => ({ ItemInfo: { nftContractId: ADDRESS.NFT_CONTRACT, tokenId } });

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

export { getMarketNFTPayload, getNFTProps };
