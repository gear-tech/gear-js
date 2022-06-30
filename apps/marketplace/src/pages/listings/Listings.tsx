import { useState } from 'react';
import { InfoText, Loader } from 'components';
import { useMarketplace } from 'hooks';
import { MarketNFT } from 'types';
import { Header } from './header';
import { NFT } from './nft';
import styles from './Listings.module.scss';

const filters = ['All', 'Buy now', 'On auction', 'Has offers'];

function Listings() {
  const { NFTs, isEachNFTRead } = useMarketplace();
  const [filter, setFilter] = useState('All');

  const getFilteredNft = (nft: MarketNFT) => {
    const { price, auction, offers } = nft;

    switch (filter) {
      case 'Buy now':
        return !!price;
      case 'On auction':
        return !!auction;
      case 'Has offers':
        return auction ? auction.bids.length > 0 : offers.length > 0;
      default:
        return nft;
    }
  };

  const filteredNfts = NFTs?.filter(getFilteredNft);
  const isAnyNft = !!filteredNfts?.length;

  const getNFTs = () =>
    filteredNfts?.map((nft) => {
      const { tokenId, auction, price } = nft;
      const { currentPrice } = auction || {};

      return <NFT key={tokenId} id={tokenId} price={price || currentPrice} isAuction={!!auction} />;
    });

  return (
    <>
      <Header text="NFT Marketplace" filter={filter} filters={filters} onFilterChange={setFilter} />
      {isEachNFTRead ? (
        <>
          {isAnyNft && <ul className={styles.list}>{getNFTs()}</ul>}
          {!isAnyNft && <InfoText text="There are no listings at the moment." />}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export { Listings };
