import { useState } from 'react';
import marketplaceMetaWasm from 'assets/wasm/marketplace.meta.wasm';
import { CONTRACT_ADDRESS } from 'consts';
import { useMetadata, useReadState } from 'hooks';
import Header from './header';
import List from './list';
import * as init from './init';

function Listings() {
  const [filter, setFilter] = useState('All');
  const isAnyFilter = filter !== 'All';

  const { metaBuffer } = useMetadata(marketplaceMetaWasm);
  const state = useReadState(CONTRACT_ADDRESS, metaBuffer, { AllItems: null });

  console.log(state);

  const getFilteredCards = () => init.cards.filter((card) => card.filter === filter);

  return (
    <>
      <Header text="NFT Marketplace" filters={init.filters} filter={filter} onFilterChange={setFilter} />
      <List cards={isAnyFilter ? getFilteredCards() : init.cards} />
    </>
  );
}

export default Listings;
