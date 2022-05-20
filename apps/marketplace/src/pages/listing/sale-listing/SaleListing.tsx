import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { ConfirmationModal, Listing, PriceModal } from 'components';
import OnLogin from 'components/on-login';
import { NFT_CONTRACT_ADDRESS } from 'consts';
import { useMarketplaceMessage } from 'hooks';
import { useState } from 'react';
import { Offer } from 'types';

type Props = {
  isOwner: boolean;
  id: string;
  heading: string;
  description: string;
  owner: Hex;
  image: string;
  offers: Offer[];
  price?: string;
  royalty?: number;
  rarity?: string;
  attrs?: { [key: string]: string };
};

function SaleListing(props: Props) {
  const { isOwner, id, heading, description, owner, image, offers, price, royalty, rarity, attrs } = props;

  const sendMessage = useMarketplaceMessage();

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
    const payload = { BuyItem: { nftContractId: NFT_CONTRACT_ADDRESS, tokenId: id } };
    const value = price?.replaceAll(',', '');

    sendMessage(payload, value).then(closeModal);
  };

  const offer = (priceValue: string) => {
    const payload = {
      AddOffer: {
        nftContractId: NFT_CONTRACT_ADDRESS,
        ftContractId: null,
        tokenId: id,
        price: priceValue,
      },
    };

    sendMessage(payload, priceValue).then(closeModal);
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
        <OnLogin>
          {!isOwner && (
            <>
              <Button color="secondary" text="Make offer" onClick={openPriceModal} block />
              <Button text="Buy now" onClick={openConfirmationModal} block />
            </>
          )}
        </OnLogin>
      </Listing>
      {isConfirmationModalOpen && <ConfirmationModal heading="Buy item?" close={closeModal} onSubmit={buy} />}
      {isPriceModalOpen && <PriceModal heading="Enter your offer" close={closeModal} onSubmit={offer} />}
    </>
  );
}

export default SaleListing;
