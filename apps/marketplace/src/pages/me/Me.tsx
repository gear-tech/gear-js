import { List } from 'components';
import { useMergedOwnerNFTs } from 'hooks';

function Me() {
  const { NFTs, isEachNFTRead } = useMergedOwnerNFTs();

  return (
    <List heading="My NFTs" NFTs={{ list: NFTs, isRead: isEachNFTRead, fallback: "You don't have any tokens yet." }} />
  );
}

export { Me };
