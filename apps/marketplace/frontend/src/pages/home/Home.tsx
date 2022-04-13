import { useState } from 'react';
import Header from './header';
import List from './list';
import { filters, cards } from './init';

function Home() {
  const [filter, setFilter] = useState('All');

  return (
    <>
      <Header text="NFT Marketplace" filters={filters} filter={filter} onFilterChange={setFilter} />
      <List cards={cards} />
    </>
  );
}

export default Home;
