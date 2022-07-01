import { Button } from '@gear-js/ui';
import { Listing, PriceModal, OnLogin } from 'components';
import { useState } from 'react';
import { AuctionFormValues, Listing as ListingType } from 'types';
import { AuctionModal } from './auction-modal';

type Props = {
  isOwner: boolean;
  item: ListingType;
  onAuctionSubmit: (values: AuctionFormValues, onSuccess: () => void) => void;
  onSaleSubmit: (value: string, onSuccess: () => void) => void;
};

function OwnerListing({ isOwner, item, onAuctionSubmit, onSaleSubmit }: Props) {
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  const openAuctionModal = () => setIsAuctionModalOpen(true);
  const openPriceModal = () => setIsPriceModalOpen(true);

  const closeModal = () => {
    setIsAuctionModalOpen(false);
    setIsPriceModalOpen(false);
  };

  return (
    <>
      <Listing item={item}>
        <OnLogin>
          {isOwner && (
            <>
              <Button text="Start auction" onClick={openAuctionModal} block />
              <Button text="Start sale" onClick={openPriceModal} block />
            </>
          )}
        </OnLogin>
      </Listing>
      {isAuctionModalOpen && <AuctionModal close={closeModal} onSubmit={onAuctionSubmit} />}
      {isPriceModalOpen && (
        <PriceModal heading="Enter price to start sale" close={closeModal} onSubmit={onSaleSubmit} />
      )}
    </>
  );
}

export { OwnerListing };
