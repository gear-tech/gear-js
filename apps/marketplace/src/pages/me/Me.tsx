import { useOwnersNft } from 'hooks';
import List from './list';
import styles from './Me.module.scss';

function Me() {
  const nfts = useOwnersNft();

  return (
    <>
      <h2 className={styles.heading}>My NFTs</h2>
      <div className={styles.main}>{nfts && <List nfts={nfts} />}</div>
    </>
  );
}

export default Me;
