import Card from '../card';
import Offer from './offer';
import styles from './Details.module.scss';

function Details() {
  return (
    <div>
      <Card heading="Rarity" text="Common" />
      <Card heading="Attributes">
        <p className={styles.text}>Background: white</p>
        <p className={styles.text}>Eyes: violet</p>
        <p className={styles.text}>Color: yellow</p>
        <p className={styles.text}>Mouth: smile</p>
      </Card>
      <Card heading="Offers">
        <Offer bid={100} bidder="Bob 123" time="Expires tomorrow" />
        <Offer bid={100} bidder="Bob 123" time="Expires tomorrow" />
        <Offer bid={100} bidder="Bob 123" time="Expires tomorrow" />
      </Card>
    </div>
  );
}

export default Details;
