import { InfoText, Loader } from 'components';
import { Filter, NFT as NFTType } from 'types';
import { getIpfsAddress } from 'utils';
import { Header } from './header';
import { NFT } from './nft';
import styles from './List.module.scss';

type NFTs = {
  list: NFTType[] | undefined;
  isRead: boolean;
  fallback: string;
};

type Props = {
  heading: string;
  NFTs: NFTs;
  filter?: Filter;
};

function List({ heading, filter, NFTs }: Props) {
  const { list, isRead, fallback } = NFTs;
  const isAnyNft = !!list?.length;

  const getNFTs = () =>
    list?.map((nft) => {
      const { id, auction, price, media, name } = nft;

      const { currentPrice } = auction || {};
      const isAuction = !!auction;

      const path = `/listing/${id}`;
      const src = getIpfsAddress(media);
      const text = `#${id}`;
      const priceHeading = isAuction ? 'Top bid' : 'Price';
      const priceText = price || currentPrice || 'None';
      const buttonText = isAuction ? 'Make bid' : 'Buy now';

      return (
        <NFT
          key={id}
          path={path}
          src={src}
          name={name}
          text={text}
          priceHeading={priceHeading}
          priceText={priceText}
          buttonText={buttonText}
        />
      );
    });

  return (
    <>
      <Header text={heading} filter={filter} />
      {isRead ? (
        <>
          {isAnyNft && <ul className={styles.list}>{getNFTs()}</ul>}
          {!isAnyNft && <InfoText text={fallback} />}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export { List };
