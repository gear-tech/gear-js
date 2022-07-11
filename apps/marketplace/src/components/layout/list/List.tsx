import { InfoText, Loader } from 'components';
import { Filter, NFT as NFTType } from 'types';
import { getNFTProps } from 'utils';
import { useAccount } from '@gear-js/react-hooks';
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

  const { account } = useAccount();

  const getNFTs = () =>
    list?.map((nft) => {
      const { id, ownerId } = nft;
      const isOwner = account?.decodedAddress === ownerId;
      const { name, path, src, text, price, button } = getNFTProps(nft, isOwner);

      return <NFT key={id} path={path} src={src} name={name} text={text} price={price} button={button} />;
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
