import { useState } from 'react';
import { Filter } from 'components';
import styles from './Home.module.scss';

const buttons = ['All', 'Buy now', 'On auction', 'New', 'Has offers'];

function Home() {
  const [filter, setFilter] = useState('All');

  return (
    <header className={styles.header}>
      <h2 className={styles.heading}>NFT Marketplace</h2>
      <Filter list={buttons} value={filter} onChange={setFilter} />
    </header>
  );
}

export default Home;
