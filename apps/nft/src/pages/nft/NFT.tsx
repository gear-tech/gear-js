import { useAccount } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';
import { TokenDetails } from 'types';
import { getIpfsAddress } from 'utils';
import { Button } from '@gear-js/ui';
import { ConfirmationModal, AddressModal } from 'components';
import clsx from 'clsx';
import { Hex } from '@gear-js/api';
import { useNFT, useSendNFTMessage } from 'hooks';
import { Card } from './card';
import { Addresses } from './addresses';
import { Attributes } from './attributes';
import styles from './NFT.module.scss';

function NFT() {
  const { account } = useAccount();

  const nft = useNFT();
  const { id, name, ownerId, description, media, reference, approvedAccountIds } = nft || {};

  const heading = `${name} #${id}`;
  const src = media ? getIpfsAddress(media) : '';
  const isAnyApprovedAccount = !!approvedAccountIds?.length;
  const isOwner = account?.decodedAddress === ownerId;

  const sendMessage = useSendNFTMessage();

  const [details, setDetails] = useState<TokenDetails>();
  const { attributes, rarity } = details || {};

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [revokeAddress, setRevokeAddress] = useState('' as Hex);

  useEffect(() => {
    if (reference) {
      fetch(getIpfsAddress(reference))
        .then((response) => response.json())
        .then(setDetails);
    }
  }, [reference]);

  const openTransferModal = () => setIsTransferModalOpen(true);
  const openApproveModal = () => setIsApproveModalOpen(true);
  const openRevokeModal = (address: Hex) => setRevokeAddress(address);

  const closeModal = () => {
    setIsTransferModalOpen(false);
    setIsApproveModalOpen(false);
    setRevokeAddress('' as Hex);
  };

  const transfer = (address: Hex) => sendMessage({ Transfer: { to: address, tokenId: id } });
  const approve = (address: Hex) => sendMessage({ Approve: { to: address, tokenId: id } });
  const revoke = () => sendMessage({ Revoke: { from: revokeAddress, tokenId: id } });

  return (
    <>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.main}>
        <section>
          <div className={styles.imgCard}>
            <img src={src} alt={name} className={styles.image} />
          </div>
          {isOwner && (
            <div className={styles.buttons}>
              <Button text="Transfer" color="secondary" onClick={openTransferModal} block />
              <Button text="Approve" onClick={openApproveModal} block />
            </div>
          )}
        </section>
        <section>
          <div className={clsx(styles.main, styles.details)}>
            {ownerId && <Card heading="Owner" text={ownerId} />}
            {rarity && <Card heading="Rarity" text={rarity} />}
            {description && <Card heading="Description" text={description} />}
            {attributes && <Attributes attributes={attributes} />}
          </div>
          {isAnyApprovedAccount && (
            <Addresses list={approvedAccountIds} onAddressClick={openRevokeModal} isOwner={isOwner} />
          )}
        </section>
      </div>
      {isTransferModalOpen && <AddressModal heading="Transfer token" close={closeModal} onSubmit={transfer} />}
      {isApproveModalOpen && <AddressModal heading="Approve token" close={closeModal} onSubmit={approve} />}
      {revokeAddress && <ConfirmationModal heading="Revoke approval?" close={closeModal} onSubmit={revoke} />}
    </>
  );
}

export { NFT };
