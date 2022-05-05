import { useOwnersNft } from 'hooks';
import Header from './header';
import List from './list';
// import styles from './Me.module.scss';

const filters = ['My NFTs', 'Approved to me'];

function Me() {
  const nfts = useOwnersNft();

  return (
    <>
      <Header text="My collections" filter="My NFTs" filters={filters} onFilterChange={() => {}} />
      {nfts && <List nfts={nfts} />}
    </>
  );
}

export default Me;
