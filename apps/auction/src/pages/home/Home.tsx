import { Loader } from 'components';
import { ADDRESS } from 'consts';
import { useAuction, useNft } from 'hooks';
import { getNumber } from 'utils';
import { Buy } from './buy';
import { Sell } from './sell';

function Home() {
  const auction = useAuction();
  const { nftContractActorId, tokenId, timeLeft } = auction || {};
  const isAuctionStarted = timeLeft && !!getNumber(timeLeft);

  const { nft, isNftStateRead } = useNft(nftContractActorId, tokenId);
  const { media } = nft || {};
  const src = `${ADDRESS.IPFS_GATEWAY_ADDRESS}/${media}`;

  return auction && isNftStateRead ? (
    <>
      {isAuctionStarted && (
        <Buy
          src={src}
          timeLeft={auction.timeLeft}
          owner={auction.tokenOwner}
          contract={auction.nftContractActorId}
          token={auction.tokenId}
          startPrice={auction.startingPrice}
          currentPrice={auction.currentPrice}
          rate={auction.discountRate}
        />
      )}
      {!isAuctionStarted && <Sell />}
    </>
  ) : (
    <Loader />
  );
}

export { Home };
