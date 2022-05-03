import { useParams } from 'react-router-dom';
import { useNft } from 'hooks';
import { useEffect, useState } from 'react';
import { NFTDetails } from 'types';
// import Table from './table';
import Summary from './summary';
import Details from './details';
import Main from './main';
import SaleModal from './sale-modal';
import AuctionModal from './auction-modal';
import styles from './Listing.module.scss';

type Params = {
  id: string;
};

function Listing() {
  const { id } = useParams() as Params;
  const { name, description, media, reference, ownerId } = useNft(id) || {};

  const [details, setDetails] = useState<NFTDetails>();
  const { royalty, rarity, attributes } = details || {};

  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  const heading = `${name} #${id}`;

  useEffect(() => {
    if (reference) {
      fetch(reference)
        .then((response) => response.json())
        .then(setDetails);
    }
  }, [reference]);

  const openAuctionModal = () => {
    setIsAuctionModalOpen(true);
  };

  const openSaleModal = () => {
    setIsSaleModalOpen(true);
  };

  const closeModal = () => {
    setIsSaleModalOpen(false);
    setIsAuctionModalOpen(false);
  };

  return (
    <>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.listing}>
        <Summary description={description} royalty={royalty} owner={ownerId} />
        <Main name={name} media={media} onAuctionButtonClick={openAuctionModal} onSaleButtonClick={openSaleModal} />
        <Details rarity={rarity} attrs={attributes} />
      </div>
      {/* <Table /> */}
      {isSaleModalOpen && <SaleModal close={closeModal} />}
      {isAuctionModalOpen && <AuctionModal close={closeModal} />}
    </>
  );
}

export default Listing;
