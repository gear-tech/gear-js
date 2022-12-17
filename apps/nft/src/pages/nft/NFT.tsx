import { useState } from 'react';
import { TokenDetails } from 'types';
import { getIpfsAddress } from 'utils';
import { ConfirmationModal, AddressModal, Loader } from 'components';
import { Hex } from '@gear-js/api';
import { useNFT, useSendNFTMessage } from 'hooks';
import { Content } from './content';

function NFT() {
  const nft = useNFT();
  const { tokenId: id } = nft || {};

  const sendMessage = useSendNFTMessage();

  const [details, setDetails] = useState<TokenDetails>();
  const { attributes, rarity } = details || {};

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [revokedAddress, setRevokedAddress] = useState('' as Hex);

  const openTransferModal = () => setIsTransferModalOpen(true);
  const openApproveModal = () => setIsApproveModalOpen(true);
  // const openRevokeModal = (address: Hex) => setRevokedAddress(address);

  const closeModal = () => {
    setIsTransferModalOpen(false);
    setIsApproveModalOpen(false);
    setRevokedAddress('' as Hex);
  };

  const onSuccess = closeModal;

  const transfer = (address: Hex) => sendMessage({ Transfer: { to: address, tokenId: id } }, { onSuccess });
  const approve = (address: Hex) => sendMessage({ Approve: { to: address, tokenId: id } }, { onSuccess });
  const revoke = () => sendMessage({ RevokeApproval: { approvedAccount: revokedAddress, tokenId: id } }, { onSuccess });

  return (
    <>
      {nft?.tokenId ? (
        <Content
          heading={`${nft.name} #${nft.tokenId}`}
          image={getIpfsAddress(nft.linkToMedia as string)}
          ownerId={nft.ownerId}
          description={nft.description as string}
          // approvedAccounts={nft.approvedAccountIds as Hex}  // todo: remove
          rarity={rarity}  // todo: remove
          attributes={attributes}  // todo: remove
          onTransferButtonClick={openTransferModal}
          onApproveButtonClick={openApproveModal}
          // onRevokeButtonClick={openRevokeModal}
        />
      ) : (
        <Loader />
      )}
      {isTransferModalOpen && <AddressModal heading="Transfer token" close={closeModal} onSubmit={transfer} />}
      {isApproveModalOpen && <AddressModal heading="Approve token" close={closeModal} onSubmit={approve} />}
      {revokedAddress && <ConfirmationModal heading="Revoke approval?" close={closeModal} onSubmit={revoke} />}
    </>
  );
}

export { NFT };
