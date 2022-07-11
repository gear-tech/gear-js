import { useState } from 'react';
import { Button } from '@gear-js/ui';
import { Listing, PriceModal, ConfirmationModal, OnLogin } from 'components';
import { Listing as ListingType } from 'types';
import styles from './AuctionListing.module.scss';

type Props = {
  isOwner: boolean;
  item: ListingType;
  date: { startDate: string; endDate: string; isAuctionOver: boolean };
  onBidSubmit: (value: string, onSuccess: () => void) => void;
  onSettleSubmit: (onSuccess: () => void) => void;
};

function AuctionListing({ isOwner, item, date, onBidSubmit, onSettleSubmit }: Props) {
  const { startDate, endDate, isAuctionOver } = date;

  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const openPriceModal = () => setIsPriceModalOpen(true);
  const openConfirmationModal = () => setIsConfirmationModalOpen(true);

  const closeModal = () => {
    setIsPriceModalOpen(false);
    setIsConfirmationModalOpen(false);
  };

  return (
    <>
      <Listing item={item}>
        <div className={styles.body}>
          <p className={styles.time}>
            <span>Start time: {startDate}</span>
            <span>End time: {endDate}</span>
          </p>
          <OnLogin>
            {isOwner
              ? isAuctionOver && <Button text="Settle auction" onClick={openConfirmationModal} block />
              : !isAuctionOver && <Button text="Make bid" onClick={openPriceModal} block />}
          </OnLogin>
        </div>
      </Listing>
      {isPriceModalOpen && (
        <PriceModal heading={`Enter your bid. Min price is ${item.price}`} close={closeModal} onSubmit={onBidSubmit} />
      )}
      {isConfirmationModalOpen && (
        <ConfirmationModal heading="Settle auction?" close={closeModal} onSubmit={onSettleSubmit} />
      )}
    </>
  );
}

export { AuctionListing };
