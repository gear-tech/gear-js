import Card from './card';
import CardType from './types';
import styles from './List.module.scss';

type Props = {
  cards: CardType[];
};

function Listing({ cards }: Props) {
  const getCards = () =>
    cards.map(({ image, collection, name, value, isAuction }) => (
      <Card key={name} image={image} collection={collection} name={name} value={value} isAuction={isAuction} />
    ));

  return <ul className={styles.list}>{getCards()}</ul>;
}

export default Listing;
