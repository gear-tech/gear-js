import { useReadState } from '@gear-js/react-hooks';
import { NftMetaWasm } from 'assets';
import { ADDRESS } from 'consts';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Token, TokenDetails } from 'types';
import { getIpfsAddress } from 'utils';
import { Card } from './card';
import { Addresses } from './addresses';
import { Attributes } from './attributes';
import styles from './NFT.module.scss';

type Params = {
  id: string;
};

type TokenState = { Token: { token: Token } };

function NFT() {
  const { id } = useParams() as Params;

  const payload = useMemo(() => ({ Token: { tokenId: id } }), [id]);
  const nft = useReadState(ADDRESS.NFT_CONTRACT, NftMetaWasm, payload) as TokenState | undefined;

  const { name, ownerId, description, media, reference, approvedAccountIds } = nft?.Token.token || {};

  const heading = `${name} #${id}`;
  const src = media ? getIpfsAddress(media) : '';
  const isAnyApprovedAccount = !!approvedAccountIds?.length;

  const [details, setDetails] = useState<TokenDetails>();
  const { attributes, rarity } = details || {};

  useEffect(() => {
    if (reference) {
      fetch(getIpfsAddress(reference))
        .then((response) => response.json())
        .then(setDetails);
    }
  }, [reference]);

  return (
    <>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.main}>
        <section>
          <div className={styles.imgCard}>
            <img src={src} alt={name} className={styles.image} />
          </div>
        </section>
        <section>
          <div className={styles.main}>
            {ownerId && <Card heading="Owner" text={ownerId} />}
            {rarity && <Card heading="Rarity" text={rarity} />}
            {description && <Card heading="Description" text={description} />}
            {attributes && <Attributes attributes={attributes} />}
          </div>
          {isAnyApprovedAccount && <Addresses list={approvedAccountIds} />}
        </section>
      </div>
    </>
  );
}

export { NFT };
