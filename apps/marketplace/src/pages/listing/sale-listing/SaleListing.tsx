import { Button } from '@gear-js/ui';
import { ConfirmationModal, Listing, PriceModal, OnLogin } from 'components';
import { useState } from 'react';
import { Listing as ListingType } from 'types';

type Props = {
  isOwner: boolean;
  item: ListingType;
  onBuySubmit: (onSuccess: () => void) => void;
  onOfferSubmit: (value: string, onSuccess: () => void) => void;
};

function SaleListing({ isOwner, item, onBuySubmit, onOfferSubmit }: Props) {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  const openConfirmationModal = () => setIsConfirmationModalOpen(true);
  const openPriceModal = () => setIsPriceModalOpen(true);

  const closeModal = () => {
    setIsConfirmationModalOpen(false);
    setIsPriceModalOpen(false);
  };

  return (
    <>
      <Listing item={item}>
        <OnLogin>
          {!isOwner && (
            <>
              <Button color="secondary" text="Make offer" onClick={openPriceModal} block />
              <Button text="Buy now" onClick={openConfirmationModal} block />
            </>
          )}
        </OnLogin>
      </Listing>
      {isConfirmationModalOpen && <ConfirmationModal heading="Buy item?" close={closeModal} onSubmit={onBuySubmit} />}
      {isPriceModalOpen && <PriceModal heading="Enter your offer" close={closeModal} onSubmit={onOfferSubmit} />}
    </>
  );
}

export { SaleListing };
