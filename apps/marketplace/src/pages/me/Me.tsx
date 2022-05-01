import { Filter } from 'components';
import { useNft } from 'hooks';
// import styles from './Me.module.scss';

const filters = ['My NFTs', 'Approved to me'];

function Me() {
  const nft = useNft(0);

  console.log(nft);

  return (
    <>
      <Filter list={filters} value="My NFTS" onChange={() => {}} />
      {/* <List cards={} /> */}
    </>
  );
}

export default Me;
