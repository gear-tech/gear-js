import { Button } from '@gear-js/ui';
import clsx from 'clsx';
import { Content } from 'components';
import { useAuctionMessage, useCountdown } from 'hooks';
import { getCountdownNumber, getNumber } from 'utils';
import { Auction } from 'types';
import { Countdown } from './countdown';
import styles from './Buy.module.scss';

type Props = {
  src: string;
  auction: Auction;
  onCountdownReset: () => void;
  onCountdownSet: () => void;
};

function Buy({ src, auction, onCountdownSet, onCountdownReset }: Props) {
  const { timeLeft, tokenOwner, nftContractActorId, tokenId, startingPrice, currentPrice, discountRate } = auction;
  const sendMessage = useAuctionMessage();

  const { hours, minutes, seconds, price } = useCountdown(
    getCountdownNumber(timeLeft),
    getNumber(currentPrice),
    getNumber(discountRate),
    onCountdownReset,
    onCountdownSet,
  );

  const countdownClassName = clsx(styles.text, styles.countdown);
  const addressClassName = clsx(styles.value, styles.address);

  const buy = () => sendMessage({ Buy: null }, { value: price + 500 }); // adding 500 to avoid error on too low refund value

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
          <p className={styles.text}>
            <span className={styles.key}>Start price:</span>
            <span className={styles.value}>{startingPrice}</span>
          </p>
          <p className={styles.text}>
            <span className={styles.key}>Current price:</span>
            <span className={styles.value}>{price}</span>
          </p>
        </div>
        <Button text="Buy item" onClick={buy} block />
      </Content>
    </>
  );
}

export { Buy };
