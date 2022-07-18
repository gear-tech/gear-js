import { useState } from 'react';
import { useNFTs, useOwnerNFTs, useApprovedNFTs } from 'hooks';
import { InfoText, Loader } from 'components';
import { FILTERS } from 'consts';
import { useAccount } from '@gear-js/react-hooks';
import { NFT } from './nft';
import { Filter } from './filter';
import styles from './Home.module.scss';

function Home() {
  const [filter, setFilter] = useState('All');
  const { account } = useAccount();

  const nfts = useNFTs();
  const { ownerNFTs, isOwnerNFTsRead } = useOwnerNFTs();
  const { approvedNFTs, isApprovedNFTsRead } = useApprovedNFTs();

  const getList = () => {
    switch (filter) {
      case 'My':
        return ownerNFTs;
      case 'Approved':
        return approvedNFTs;
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
  const isEachNftLoaded = nfts && (account ? isOwnerNFTsRead && isApprovedNFTsRead : true);
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
          {!isAnyNft && <InfoText text="There are no NFTs at the moment." />}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export { Home };
