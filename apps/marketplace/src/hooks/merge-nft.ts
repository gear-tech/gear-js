import { useAlert, useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';
import { NFT, MarketNFTState, NFTState } from 'types';
import { useGetMarketNftPayload, useMarketplace } from './marketplace';
import { useOwnersNft } from './nft';
import { useWasm } from './context';

function useMergedNFTs() {
  const { api } = useApi();
  const alert = useAlert();

  const { nft } = useWasm();
  const { NFTs: marketNFTs } = useMarketplace();

  const [NFTs, setNFTs] = useState<NFT[]>([]);
  const [isEachNFTRead, setIsEachNFTRead] = useState(false);

  useEffect(() => {
    if (marketNFTs) {
      const combinedNFTs = marketNFTs.map((marketNft) =>
        api.programState
          .read(nft.programId, nft.metaBuffer, { Token: { tokenId: marketNft.tokenId } })
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
  }, [marketNFTs]);

  return { NFTs, isEachNFTRead };
}

function useMergedOwnerNFTs() {
  const { api } = useApi();
  const alert = useAlert();

  const { marketplace } = useWasm();
  const { NFTs: ownerNFTs } = useOwnersNft();
  const getMarketNFTPayload = useGetMarketNftPayload();

  const [NFTs, setNFTs] = useState<NFT[]>([]);
  const [isEachNFTRead, setIsEachNFTRead] = useState(false);

  useEffect(() => {
    if (ownerNFTs) {
      const combinedNFTs = ownerNFTs.map(
        (baseNft) =>
          api.programState
            .read(marketplace.programId, marketplace.metaBuffer, getMarketNFTPayload(baseNft.id))
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
  }, [ownerNFTs]);

  return { NFTs, isEachNFTRead };
}

export { useMergedNFTs, useMergedOwnerNFTs };
