import { NFT } from 'types';
import Card from './card';
import styles from './List.module.scss';

type Props = {
  nfts: NFT[];
};

function List({ nfts }: Props) {
  const getCards = () => nfts.map(({ id, name, media }) => <Card key={id} id={id} name={name} media={media} />);

  return <ul className={styles.list}>{getCards()}</ul>;
}

export default List;
