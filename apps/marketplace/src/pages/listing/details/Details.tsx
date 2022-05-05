import Card from '../card';
// import Offer from './offer';
import styles from './Details.module.scss';
import Offer from './offer';

type Props = {
  rarity?: string;
  attrs?: { [key: string]: string };
  offers?: any[];
};

function Details({ rarity, attrs, offers }: Props) {
  // TODO: ! assert, lint rule
  const getAttributes = () =>
    // eslint-disable-next-line react/no-array-index-key
    Object.keys(attrs!).map((attr, index) => <p key={index} className={styles.text}>{`${attr}: ${attrs![attr]}`}</p>);

  return (
    <div>
      {rarity && <Card heading="Rarity" text={rarity} />}
      {attrs && <Card heading="Attributes">{getAttributes()}</Card>}
      {offers && (
        <Card heading="Offers">
          {offers?.map(() => (
            <Offer bid={100} bidder="Bob 123" time="Expires tomorrow" />
          ))}
        </Card>
      )}
    </div>
  );
}

export default Details;
