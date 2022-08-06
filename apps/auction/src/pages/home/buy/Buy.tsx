import { Button } from '@gear-js/ui';
import { useAccount } from '@gear-js/react-hooks';
import clsx from 'clsx';
import { Content, Info } from 'components';
import { useAuctionMessage, useCountdown } from 'hooks';
import { getCountdownNumber, getNumber } from 'utils';
import { Auction } from 'types';
import { MIN_TRANSFER_AMOUNT } from 'consts';
import { Countdown } from './countdown';
import styles from './Buy.module.scss';

type Props = {
  src: string;
  auction: Auction;
  onCountdownReset: () => void;
  onCountdownSet: () => void;
};

function Buy({ src, auction, onCountdownSet, onCountdownReset }: Props) {
  const { timeLeft, tokenOwner, nftContractActorId, tokenId, startingPrice, currentPrice, discountRate, auctionOwner } =
    auction;

  const { account } = useAccount();
  const sendMessage = useAuctionMessage();

  const { hours, minutes, seconds, price } = useCountdown(
    getCountdownNumber(timeLeft),
    getNumber(currentPrice),
    getNumber(discountRate),
    onCountdownReset,
    onCountdownSet,
  );

  const isOwner = account?.decodedAddress === auctionOwner;
  const countdownClassName = clsx(styles.text, styles.countdown);
  const addressClassName = clsx(styles.value, styles.address);
  const currentPriceClassName = clsx(styles.value, styles.currentPrice);

  // adding min transfer amount to avoid error on too low refund value
  const buy = () => sendMessage({ Buy: null }, { value: price + MIN_TRANSFER_AMOUNT });

  return (
    <>
      <div className={styles.imgWrapper}>
        <img src={src} alt="" className={styles.image} />
      </div>
      <Content heading="Buy NFT">
        <div className={countdownClassName}>
          <span className={styles.key}>Time left:</span>
          <Countdown hours={hours} minutes={minutes} seconds={seconds} />
        </div>
        <p className={styles.text}>
          <span className={styles.key}>Owner address:</span>
          <span className={addressClassName}>{tokenOwner}</span>
        </p>
        <p className={styles.text}>
          <span className={styles.key}>Contract address:</span>
          <span className={addressClassName}>{nftContractActorId}</span>
        </p>
        <p className={styles.text}>
          <span className={styles.key}>Token ID:</span>
          <span className={styles.value}>{tokenId}</span>
        </p>
        <div className={styles.prices}>
          <div className={styles.text}>
            <div className={styles.startPrice}>
              <span className={styles.key}>Start price:</span>
            </div>
            <span className={styles.value}>{startingPrice}</span>
          </div>
          <p className={styles.text}>
            <span className={styles.key}>Current price:</span>
            <span className={currentPriceClassName}>{price}</span>
          </p>
        </div>
        {isOwner ? (
          <Info text="You can't participate in your own auction" />
        ) : (
          <Button text="Buy item" onClick={buy} block />
        )}
      </Content>
    </>
  );
}

export { Buy };
