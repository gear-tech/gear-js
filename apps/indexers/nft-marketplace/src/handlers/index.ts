import { marketplaceInit, handleMarketplaceEvent } from './marketplace';
import { nftInit, handleNftEvent } from './nft';

export const handlersAreReady = Promise.all([marketplaceInit, nftInit]);

export { handleMarketplaceEvent, handleNftEvent };
