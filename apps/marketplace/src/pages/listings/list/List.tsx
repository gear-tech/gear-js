import InfoText from 'components/info-text';
import { MarketNFT } from 'types';
import Card from './card';
import styles from './List.module.scss';

interface ExtendedMarketNFT extends MarketNFT {
  isVisible: boolean;
}

type Props = {
  nfts: ExtendedMarketNFT[];
};

function List({ nfts }: Props) {
  const isAnyNft = nfts.length > 0;

  const getCards = () =>
    nfts.map((nft) => {
      const { tokenId, auction, price } = nft;
      const { currentPrice } = auction || {};

      return (
        <Card
          key={tokenId}
          id={tokenId}
          price={price || currentPrice}
          isAuction={!!auction}
          isVisible={nft.isVisible}
        />
      );
    });

  return isAnyNft ? (
    <ul className={styles.list}>{getCards()}</ul>
  ) : (
    <InfoText text="There are no listings at the moment." />
  );
}

export default List;
