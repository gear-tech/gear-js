import { useOwnersNft } from 'hooks';
import List from './list';
import styles from './Me.module.scss';

function Me() {
  const nfts = useOwnersNft();

  return (
    <>
      <h2 className={styles.heading}>My Collections</h2>
      {nfts && <List nfts={nfts} />}
    </>
  );
}

export default Me;
