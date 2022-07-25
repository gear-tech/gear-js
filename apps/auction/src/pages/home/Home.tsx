import { Loader } from 'components';
import { ADDRESS } from 'consts';
import { useAuction, useNft, useStatus } from 'hooks';
import { Buy } from './buy';
import { Sell } from './sell';
import { Start } from './start';

function Home() {
  const auction = useAuction();
  const { nftContractActorId, tokenId } = auction || {};

  const { nft, isNftStateRead } = useNft(nftContractActorId, tokenId);
  const { media } = nft || {};
  const src = `${ADDRESS.IPFS_GATEWAY_ADDRESS}/${media}`;

  const { status, resetStatus, setExpiredStatus, setRunningStatus } = useStatus(auction?.status);
  const purchasePrice = typeof status === 'object' ? status.Purchased.price : undefined;

  return auction && isNftStateRead ? (
    <>
      {status === 'IsRunning' && (
        <Buy src={src} auction={auction} onCountdownReset={setExpiredStatus} onCountdownSet={setRunningStatus} />
      )}
      {status === 'None' && <Sell />}
      {(status === 'Expired' || purchasePrice) && <Start price={purchasePrice} onSubmit={resetStatus} />}
    </>
  ) : (
    <Loader />
  );
}

export { Home };
