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
  const getCards = () =>
    nfts.map((nft) => {
      const { tokenId, auction, price } = nft;
      const { currentPrice } = auction || {};

      return (
        <Card
          key={tokenId}
          id={tokenId}
          price={price || (currentPrice as string)}
          isAuction={!!auction}
          isVisible={nft.isVisible}
        />
      );
    });

  return <ul className={styles.list}>{getCards()}</ul>;
}

export default List;
