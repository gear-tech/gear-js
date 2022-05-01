import { marketplaceMetaWasm } from 'assets';
import { MARKETPLACE_CONTRACT_ADDRESS } from 'consts';
import { useMetadata, useReadState } from './api';

function useMarketplaceMeta() {
  const { metadata, metaBuffer } = useMetadata(marketplaceMetaWasm);

  return { marketplaceMeta: metadata, marketplaceMetaBuffer: metaBuffer };
}

function useMarketplaceState() {
  const { marketplaceMetaBuffer } = useMarketplaceMeta();
  const marketplaceState = useReadState(MARKETPLACE_CONTRACT_ADDRESS, marketplaceMetaBuffer);

  return marketplaceState;
}

export { useMarketplaceMeta, useMarketplaceState };
