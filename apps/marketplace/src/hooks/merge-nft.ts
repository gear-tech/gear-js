import { useAlert, useApi, useMetadata } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';
import nftMetaWasm from 'assets/wasm/nft.meta.wasm';
import marketplaceMetaWasm from 'assets/wasm/marketplace.meta.wasm';
import { ADDRESS } from 'consts';
import { NFT, MarketNFTState, NFTState } from 'types';
import { getMarketNFTPayload } from 'utils';
import { useMarketplace } from './marketplace';
import { useOwnersNft } from './nft';

function useMergedNFTs() {
  const { api } = useApi();
  const alert = useAlert();

  const { metaBuffer: nftMetaBuffer } = useMetadata(nftMetaWasm);
  const { NFTs: marketNFTs } = useMarketplace();

  const [NFTs, setNFTs] = useState<NFT[]>([]);
  const [isEachNFTRead, setIsEachNFTRead] = useState(false);

  useEffect(() => {
    if (marketNFTs && nftMetaBuffer) {
      const combinedNFTs = marketNFTs.map((marketNft) =>
        api.programState
          .read(ADDRESS.NFT_CONTRACT, nftMetaBuffer, { Token: { tokenId: marketNft.tokenId } })
          .then((state) => state.toHuman() as NFTState)
          .then((state) => state.Token.token)
          .then((baseNft) => ({ ...marketNft, ...baseNft })),
      );

      Promise.all(combinedNFTs)
        .then((result) => {
          setNFTs(result);
          setIsEachNFTRead(true);
        })
        .catch(({ message }: Error) => alert.error(message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketNFTs, nftMetaBuffer]);

  return { NFTs, isEachNFTRead };
}

function useMergedOwnerNFTs() {
  const { api } = useApi();
  const alert = useAlert();

  const { metaBuffer: marketMetaBuffer } = useMetadata(marketplaceMetaWasm);
  const { NFTs: ownerNFTs } = useOwnersNft();

  const [NFTs, setNFTs] = useState<NFT[]>([]);
  const [isEachNFTRead, setIsEachNFTRead] = useState(false);

  useEffect(() => {
    if (ownerNFTs && marketMetaBuffer) {
      const combinedNFTs = ownerNFTs.map(
        (baseNft) =>
          api.programState
            .read(ADDRESS.MARKETPLACE_CONTRACT, marketMetaBuffer, getMarketNFTPayload(baseNft.id))
            .then((state) => state.toHuman() as MarketNFTState)
            .then((state) => state.ItemInfo)
            .then((marketNft) => ({ ...marketNft, ...baseNft })), // order is important
      );

      Promise.all(combinedNFTs)
        .then((result) => {
          setNFTs(result);
          setIsEachNFTRead(true);
        })
        .catch(({ message }: Error) => alert.error(message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerNFTs, marketMetaBuffer]);

  return { NFTs, isEachNFTRead };
}

export { useMergedNFTs, useMergedOwnerNFTs };
