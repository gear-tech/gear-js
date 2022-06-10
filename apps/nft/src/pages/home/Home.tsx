import { useState } from 'react';
import { useApprovedNFTs, useNFTs, useOwnerNFTs } from 'hooks';
import { Loader } from 'components';
import { FILTERS } from 'consts';
import { useAccount } from '@gear-js/react-hooks';
import { NFT } from './nft';
import { Filter } from './filter';
import styles from './Home.module.scss';

function Home() {
  const [filter, setFilter] = useState('All');
  const { account } = useAccount();

  const nfts = useNFTs();
  const ownerNfts = useOwnerNFTs();
  const approvedNfts = useApprovedNFTs();

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

  const NFTs = getNFTs();
  const isEachNftLoaded = nfts && ownerNfts && approvedNfts;
  const isAnyNft = !!NFTs?.length;

  return (
    <>
      <header className={styles.header}>
        <h2 className={styles.heading}>NFTs</h2>
        {account && <Filter list={FILTERS} value={filter} onChange={setFilter} />}
      </header>
      {isEachNftLoaded ? (
        <>
          {isAnyNft && <ul className={styles.list}>{NFTs}</ul>}
          {!isAnyNft && <p className={styles.text}>There are no NFTs at the moment.</p>}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export { Home };
