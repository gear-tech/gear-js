import { useAccount, useReadState } from '@gear-js/react-hooks';
import { NftMetaWasm } from 'assets';
import { ADDRESS } from 'consts';
import { useMemo, useState } from 'react';
import { Token } from 'types';
import { NFT } from './nft';
import { Filter } from './filter';
import styles from './Home.module.scss';

type AllTokensState = { AllTokens: { tokens: Token[] } };
type OwnerTokensState = { TokensForOwner: { tokens: Token[] } };
type ApprovedTokensState = { SupplyForOwner: { supply: Token[] } };

const filters = ['All', 'My', 'Approved'];

function Home() {
  const { account } = useAccount();

  const nftsPayload = useMemo(() => ({ AllTokens: null }), []);
  const nfts = useReadState(ADDRESS.NFT_CONTRACT, NftMetaWasm, nftsPayload) as AllTokensState | undefined;

  const ownerNftsPayload = useMemo(
    () => (account ? { TokensForOwner: { owner: account.decodedAddress } } : undefined),
    [account],
  );
  const ownerNfts = useReadState(ADDRESS.NFT_CONTRACT, NftMetaWasm, ownerNftsPayload) as OwnerTokensState | undefined;

  const approvedNftsPayload = useMemo(
    () => (account ? { SupplyForOwner: { owner: account.decodedAddress } } : undefined),
    [account],
  );
  const approvedNfts = useReadState(ADDRESS.NFT_CONTRACT, NftMetaWasm, approvedNftsPayload) as
    | ApprovedTokensState
    | undefined;

  const [filter, setFilter] = useState('All');

  const getList = () => {
    switch (filter) {
      case 'My':
        return ownerNfts?.TokensForOwner.tokens;
      case 'Approved':
        return approvedNfts?.SupplyForOwner.supply;
      default:
        return nfts?.AllTokens.tokens;
    }
  };

  const list = getList() || [];

  const getNFTs = () =>
    list.map(({ id, name, media }) => (
      <li key={id}>
        <NFT id={id} name={name} media={media} />
      </li>
    ));

  return (
    <>
      <header className={styles.header}>
        <h2 className={styles.heading}>My NFTs</h2>
        <Filter list={filters} value={filter} onChange={setFilter} />
      </header>
      <ul className={styles.list}>{getNFTs()}</ul>
    </>
  );
}

export { Home };
