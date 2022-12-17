import { Hex } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import clsx from 'clsx';
import { Addresses } from '../addresses';
import { Attributes } from '../attributes';
import { Card } from '../card';
import styles from './Content.module.scss';

type Props = {
  heading: string;
  image: string;
  ownerId: Hex;
  description: string;
  // approvedAccounts: Hex[];
  rarity?: string;
  attributes?: { [key: string]: string };
  onTransferButtonClick: () => void;
  onApproveButtonClick: () => void;
  // onRevokeButtonClick: (address: Hex) => void;
};

function Content(props: Props) {
  const {
    heading,
    image,
    ownerId,
    description,
    // approvedAccounts,
    rarity,
    attributes,
    onTransferButtonClick,
    onApproveButtonClick,
    // onRevokeButtonClick,
  } = props;

  const { account } = useAccount();
  const isOwner = account?.decodedAddress === ownerId;
  // const isAnyApprovedAccount = !!approvedAccounts.length;

  const detailsClassName = clsx(styles.main, styles.details);

  return (
    <>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.main}>
        <section>
          <div className={styles.imgCard}>
            <img src={image} alt="" className={styles.image} />
          </div>
          {isOwner && (
            <div className={styles.buttons}>
              <Button text="Transfer" color="secondary" onClick={onTransferButtonClick} block />
              <Button text="Approve" onClick={onApproveButtonClick} block />
            </div>
          )}
        </section>
        <section>
          <div className={detailsClassName}>
            <Card heading="Owner" text={ownerId} />
            {rarity && <Card heading="Rarity" text={rarity} />}
            <Card heading="Description" text={description} />
            {attributes && <Attributes attributes={attributes} />}
          </div>
          {/* {isAnyApprovedAccount && ( */}
          {/*  <Addresses list={approvedAccounts} onAddressClick={onRevokeButtonClick} isOwner={isOwner} /> */}
          {/* )} */}
        </section>
      </div>
    </>
  );
}

export { Content };
