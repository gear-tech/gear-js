import InfoText from 'components/info-text';
import { NFT } from 'types';
import Card from './card';
import styles from './List.module.scss';

type Props = {
  nfts: NFT[];
};

function List({ nfts }: Props) {
  const isAnyNft = nfts.length > 0;

  const getCards = () => nfts.map(({ id, name, media }) => <Card key={id} id={id} name={name} media={media} />);

  return isAnyNft ? <ul className={styles.list}>{getCards()}</ul> : <InfoText text="You don't have any tokens yet" />;
}

export default List;
