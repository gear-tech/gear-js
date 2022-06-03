import { Hex } from '@gear-js/api';
import { ReactNode } from 'react';
import { Offer as OfferType } from 'types';
import { IPFS_GATEWAY_ADDRESS } from 'consts';
import Card from './card';
import Offer from './offer';
import styles from './Listing.module.scss';

type Props = {
  children: ReactNode;
  heading: string;
  description: string;
  owner: Hex;
  image: string;
  offers: OfferType[];
  price?: string;
  royalty?: number;
  rarity?: string;
  attrs?: { [key: string]: string };
};

function Listing({ children, heading, description, owner, price, royalty, image, rarity, attrs, offers }: Props) {
  const isAnyOffer = offers.length > 0;
  const royaltyText = `${royalty}%`;
  const src = `${IPFS_GATEWAY_ADDRESS}/${image}`;

  // TODO: ! assert, lint rule
  const getAttributes = () =>
    // eslint-disable-next-line react/no-array-index-key
    Object.keys(attrs!).map((attr, index) => <p key={index} className={styles.text}>{`${attr}: ${attrs![attr]}`}</p>);

  const getOffers = () =>
    offers
      ?.map(({ price: offerPrice, id, hash_: hash }, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Offer key={index} bid={offerPrice} bidder={id} hash={hash} listingOwner={owner} />
      ))
      .reverse();

  return (
    <>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.listing}>
        <div>
          {price && <Card heading="Current price" text={price} />}
          <Card heading="Description" text={description} />
          {royalty && <Card heading="Royalty" text={royaltyText} />}
          <Card heading="Owner" text={owner} />
        </div>
        <div className={styles.main}>
          <div className={styles.imgWrapper}>
            <img src={src} alt="" className={styles.image} />
          </div>
          <div className={styles.buttons}>{children}</div>
        </div>
        <div>
          {rarity && <Card heading="Rarity" text={rarity} />}
          {attrs && <Card heading="Attributes">{getAttributes()}</Card>}
          <Card heading={isAnyOffer ? 'Offers' : 'No offers'}>{getOffers()}</Card>
        </div>
      </div>
    </>
  );
}

export default Listing;
