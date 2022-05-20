import { useMarketplace } from 'hooks';
import { useState } from 'react';
import { MarketNFT } from 'types';
import Header from './header';
import List from './list';
import styles from './Listings.module.scss';

const filters = ['All', 'Buy now', 'On auction', 'Has offers'];

type Conditions = {
  [key: string]: (nft: MarketNFT) => boolean | MarketNFT;
};

const conditions: Conditions = {
  All: (nft) => nft,
  'Buy now': ({ price }) => !!price,
  'On auction': ({ auction }) => !!auction,
  'Has offers': ({ offers, auction }) => (auction ? auction.bids.length > 0 : offers.length > 0),
};

function Listings() {
  const [filter, setFilter] = useState('All');
  const nfts = useMarketplace();

  const conditionCallback = conditions[filter];
  const filteredNfts = nfts?.map((nft) =>
    conditionCallback(nft) ? { ...nft, isVisible: true } : { ...nft, isVisible: false },
  );

  return (
    <>
      <Header text="NFT Marketplace" filter={filter} filters={filters} onFilterChange={setFilter} />
      <div className={styles.main}>{filteredNfts && <List nfts={filteredNfts} />}</div>
    </>
  );
}

export default Listings;
