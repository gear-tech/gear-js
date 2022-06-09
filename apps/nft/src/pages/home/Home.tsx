import { useState } from 'react';
import { useApprovedNFTs, useNFTs, useOwnerNFTs } from 'hooks';
import { NFT } from './nft';
import { Filter } from './filter';
import styles from './Home.module.scss';

const filters = ['All', 'My', 'Approved'];

function Home() {
  const nfts = useNFTs();
  const ownerNfts = useOwnerNFTs();
  const approvedNfts = useApprovedNFTs();

  const [filter, setFilter] = useState('All');

  const getList = () => {
    switch (filter) {
      case 'My':
        return ownerNfts;
      case 'Approved':
        return approvedNfts;
      default:
        return nfts;
    }
  };

  const getNFTs = () =>
    getList()?.map(({ id, name, media }) => (
      <li key={id}>
        <NFT id={id} name={name} media={media} />
      </li>
    ));

  return (
    <>
      <header className={styles.header}>
        <h2 className={styles.heading}>NFTs</h2>
        <Filter list={filters} value={filter} onChange={setFilter} />
      </header>
      <ul className={styles.list}>{getNFTs()}</ul>
    </>
  );
}

export { Home };
