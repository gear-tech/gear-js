import { ADDRESS } from 'consts';

const getMarketNFTPayload = (tokenId: string) => ({ ItemInfo: { nftContractId: ADDRESS.NFT_CONTRACT, tokenId } });

export { getMarketNFTPayload };
