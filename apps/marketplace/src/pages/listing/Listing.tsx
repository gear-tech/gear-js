import { useParams } from 'react-router-dom';
import { useAccount, useApi, useLoading, useMarketNft, useMarketplaceMeta, useNft, useStatus } from 'hooks';
import { useEffect, useState } from 'react';
import { NFTDetails } from 'types';
// import Table from './table';
import { GearKeyring } from '@gear-js/api';
import { MARKETPLACE_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from 'consts';
import { ConfirmationModal, PriceModal } from 'components';
import { sendMessage } from 'utils';
import Summary from './summary';
import Details from './details';
import Main from './main';
import AuctionModal from './auction-modal';
import styles from './Listing.module.scss';

type Params = {
  id: string;
};

function Listing() {
  const { id } = useParams() as Params;
  const { api } = useApi();
  const { account } = useAccount();
  const { enableLoading } = useLoading();
  const { marketplaceMeta } = useMarketplaceMeta();
  const handleStatus = useStatus();

  const { name, description, media, reference, ownerId } = useNft(id) || {};
  const { price, auction, offers } = useMarketNft(id) || {};

  const [details, setDetails] = useState<NFTDetails>();
  const { royalty, rarity, attributes } = details || {};

  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const heading = `${name} #${id}`;

  const { currentPrice, bids } = auction || {};

  const isSale = !!price;
  const isAuction = !!auction;
  const isListed = isSale || isAuction;
  const isOwner = account ? GearKeyring.decodeAddress(account.address) === ownerId : false;

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
    setIsConfirmationModalOpen(false);
  };

  const startSale = (priceValue: string) => {
    if (account && marketplaceMeta) {
      enableLoading();

      const payload = {
        AddMarketData: {
          nftContractId: NFT_CONTRACT_ADDRESS,
          ftContractId: null,
          tokenId: id,
          price: priceValue,
        },
      };

      sendMessage(api, account, MARKETPLACE_CONTRACT_ADDRESS, payload, marketplaceMeta, handleStatus);
    }
  };

  const buy = () => {
    if (account && marketplaceMeta) {
      enableLoading();

      const payload = { BuyItem: { nftContractId: NFT_CONTRACT_ADDRESS, tokenId: id } };
      sendMessage(api, account, MARKETPLACE_CONTRACT_ADDRESS, payload, marketplaceMeta, handleStatus);
    }
  };

  return (
    <>
      {name && <h2 className={styles.heading}>{heading}</h2>}
      <div className={styles.listing}>
        {description && ownerId && (
          <Summary description={description} owner={ownerId} price={price || currentPrice} royalty={royalty} />
        )}
        {name && media && (
          <Main
            name={name}
            media={media}
            onAuctionButtonClick={openAuctionModal}
            onSaleButtonClick={openSaleModal}
            isListed={isListed}
            isSale={isSale}
            isAuction={isAuction}
            isOwner={isOwner}
          />
        )}
        <Details rarity={rarity} attrs={attributes} offers={offers || bids} />
      </div>
      {/* <Table /> */}
      {isSaleModalOpen && <PriceModal close={closeModal} onSubmit={startSale} />}
      {isAuctionModalOpen && <AuctionModal close={closeModal} />}
      {isConfirmationModalOpen && <ConfirmationModal heading="test" close={closeModal} onSubmit={buy} />}
    </>
  );
}

export default Listing;
