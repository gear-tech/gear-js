import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { ConfirmationModal, Listing, PriceModal } from 'components';
import { MARKETPLACE_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from 'consts';
import { useAccount, useApi, useLoading, useMarketplaceMeta, useStatus } from 'hooks';
import { useState } from 'react';
import { sendMessage } from 'utils';

type Props = {
  isOwner: boolean;
  id: string;
  heading: string;
  description: string;
  owner: Hex;
  image: string;
  offers: any[];
  price?: string;
  royalty?: number;
  rarity?: string;
  attrs?: { [key: string]: string };
};

function SaleListing(props: Props) {
  const { isOwner, id, heading, description, owner, image, offers, price, royalty, rarity, attrs } = props;

  const { api } = useApi();
  const { account } = useAccount();
  const { enableLoading } = useLoading();
  const { marketplaceMeta } = useMarketplaceMeta();
  const handleStatus = useStatus();

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(true);
  };

  const openPriceModal = () => {
    setIsPriceModalOpen(true);
  };

  const closeModal = () => {
    setIsConfirmationModalOpen(false);
    setIsPriceModalOpen(false);
  };

  const buy = () => {
    if (account && marketplaceMeta) {
      enableLoading();

      const payload = { BuyItem: { nftContractId: NFT_CONTRACT_ADDRESS, tokenId: id } };
      sendMessage(api, account, MARKETPLACE_CONTRACT_ADDRESS, payload, marketplaceMeta, handleStatus);
    }
  };

  const offer = (priceValue: string) => {
    if (account && marketplaceMeta) {
      enableLoading();

      const payload = {
        AddOffer: {
          nftContractId: NFT_CONTRACT_ADDRESS,
          ftContractId: null,
          tokenId: id,
          price: priceValue,
        },
      };

      sendMessage(api, account, MARKETPLACE_CONTRACT_ADDRESS, payload, marketplaceMeta, handleStatus, priceValue);
    }
  };

  return (
    <>
      <Listing
        heading={heading}
        description={description}
        owner={owner}
        image={image}
        offers={offers}
        price={price}
        royalty={royalty}
        rarity={rarity}
        attrs={attrs}>
        {!isOwner && (
          <>
            <Button color="secondary" text="Make offer" onClick={openPriceModal} block />
            <Button text="Buy now" onClick={openConfirmationModal} block />
          </>
        )}
      </Listing>
      {isConfirmationModalOpen && <ConfirmationModal heading="Buy item?" close={closeModal} onSubmit={buy} />}
      {isPriceModalOpen && <PriceModal heading="Enter your offer" close={closeModal} onSubmit={offer} />}
    </>
  );
}

export default SaleListing;
